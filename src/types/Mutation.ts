import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {
  mutationType,
  stringArg,
  floatArg,
  intArg,
  booleanArg,
  arg,
} from 'nexus';

import { APP_SECRET, getUserId } from '../utils';

const add = (a = 0, b = 0) => a + b;
const minus = (a = 0, b = 0) => a - b;

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10);
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }

        const passwordValid = await compare(password, user.password);

        if (!passwordValid) {
          throw new Error('Invalid password');
        }

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });

    t.field('createAccount', {
      type: 'Account',
      args: {
        balance: floatArg({ nullable: false, default: 0 }),
        name: stringArg({ nullable: false }),
        currency: stringArg({ nullable: false }),
        color: stringArg({ nullable: false }),
      },
      resolve: (_, { balance, name, currency, color }, ctx) => {
        const userId = getUserId(ctx);

        return ctx.prisma.account.create({
          data: {
            name,
            balance,
            currency,
            color,
            user: { connect: { id: Number(userId) } },
          },
        });
      },
    });

    t.field('createRecord', {
      type: 'Record',
      args: {
        accountId: intArg({ nullable: false, default: 0 }),
        amount: floatArg({ nullable: false, default: 0 }),
        categoryId: intArg({ nullable: false }),
        labelIds: intArg({ list: true }),
        timestamp: stringArg({ nullable: false }),
        description: stringArg({ default: '' }),
      },
      resolve: async (
        _,
        { amount, categoryId, description, accountId, labelIds, timestamp },
        ctx
      ) => {
        const category = await ctx.prisma.category.findOne({
          where: {
            id: Number(categoryId),
          },
        });
        const expenseType = category?.expenseType;
        const account = await ctx.prisma.account.findOne({
          where: {
            id: Number(accountId),
          },
        });

        const balance =
          expenseType === 'IN'
            ? add(account?.balance, amount)
            : minus(account?.balance, amount);

        return Promise.all([
          ctx.prisma.account.update({
            where: {
              id: Number(accountId),
            },
            data: {
              balance,
            },
          }),
          ctx.prisma.record.create({
            data: {
              amount,
              description,
              expenseType,
              labels: {
                connect: labelIds?.map((id) => ({
                  id,
                })),
              },
              timestamp,
              category: { connect: { id: Number(categoryId) } },
              account: { connect: { id: Number(accountId) } },
            },
          }),
        ]).then(([_, record]) => record);
      },
    });

    t.field('updateRecord', {
      type: 'Record',
      args: {
        recordId: intArg({ nullable: false, default: 0 }),
        amount: floatArg({ nullable: false, default: 0 }),
        categoryId: intArg({ nullable: false }),
        labelIds: intArg({ list: true }),
        timestamp: stringArg({ nullable: false }),
        description: stringArg({ default: '' }),
      },
      resolve: async (
        _,
        { amount, recordId, categoryId, description, labelIds, timestamp },
        ctx
      ) => {
        const category = await ctx.prisma.category.findOne({
          where: {
            id: Number(categoryId),
          },
        });
        const newExpenseType = category?.expenseType;

        const oldRecord = await ctx.prisma.record.findOne({
          where: {
            id: Number(recordId),
          },
        });

        if (!oldRecord) {
          throw new Error(`No record found for recordId: ${recordId}`);
        }

        const account = await ctx.prisma.account.findOne({
          where: {
            id: Number(oldRecord.accountId),
          },
        });

        const oldBalance =
          oldRecord?.expenseType === 'IN'
            ? minus(account?.balance, oldRecord?.amount)
            : add(account?.balance, oldRecord?.amount);

        const newBalance =
          newExpenseType === 'IN'
            ? add(oldBalance, amount)
            : minus(oldBalance, amount);

        return Promise.all([
          ctx.prisma.account.update({
            where: {
              id: Number(account?.id),
            },
            data: {
              balance: newBalance,
            },
          }),
          ctx.prisma.record.update({
            where: {
              id: recordId,
            },
            data: {
              amount,
              description,
              expenseType: newExpenseType,
              labels: {
                connect: labelIds?.map((id) => ({
                  id,
                })),
              },
              timestamp,
              category: { connect: { id: Number(categoryId) } },
              account: { connect: { id: Number(account?.id) } },
            },
          }),
        ]).then(([_, record]) => record);
      },
    });

    t.field('deleteRecord', {
      type: 'Record',
      args: {
        recordId: intArg({ nullable: false, default: 0 }),
      },
      resolve: async (_, { recordId }, ctx) => {
        const record = await ctx.prisma.record.findOne({
          where: {
            id: Number(recordId),
          },
        });

        if (!record) {
          throw new Error(`No record found for recordId: ${recordId}`);
        }

        const account = await ctx.prisma.account.findOne({
          where: {
            id: Number(record?.accountId),
          },
        });

        const balance =
          record?.expenseType === 'IN'
            ? minus(account?.balance, record?.amount)
            : add(account?.balance, record?.amount);

        return Promise.all([
          ctx.prisma.account.update({
            where: {
              id: Number(record?.accountId),
            },
            data: {
              balance,
            },
          }),
          ctx.prisma.record.delete({
            where: {
              id: recordId,
            },
          }),
        ]).then(([_, record]) => record);
      },
    });

    t.field('createCategory', {
      type: 'Category',
      args: {
        name: stringArg({ nullable: false }),
        icon: stringArg(),
        expenseType: arg({
          type: 'ExpenseType',
          nullable: false,
          default: 'OUT',
        }),
        isVisible: booleanArg({ nullable: false, default: false }),
      },
      resolve: (_, { name, icon, expenseType, isVisible }, ctx) => {
        const userId = getUserId(ctx);

        return ctx.prisma.category.create({
          data: {
            name,
            icon,
            expenseType,
            isVisible,
            user: { connect: { id: Number(userId) } },
          },
        });
      },
    });

    t.field('createLabel', {
      type: 'Label',
      args: {
        name: stringArg({ nullable: false }),
        color: stringArg({ nullable: false }),
      },
      resolve: (_, { name, color }, ctx) => {
        const userId = getUserId(ctx);

        return ctx.prisma.label.create({
          data: {
            name,
            color,
            user: { connect: { id: Number(userId) } },
          },
        });
      },
    });
  },
});

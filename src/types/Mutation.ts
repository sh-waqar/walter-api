import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { mutationType, stringArg, floatArg, intArg, booleanArg } from 'nexus';
import { APP_SECRET, getUserId } from '../utils';

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
        accountId: intArg({ default: 0 }),
        amount: floatArg({ nullable: false, default: 0 }),
        categoryId: intArg({ nullable: false }),
        labelIds: intArg({ list: true }),
        timestamp: stringArg({ nullable: false }),
        description: stringArg({ default: '' }),
      },
      resolve: (
        _,
        { amount, categoryId, description, accountId, labelIds, timestamp },
        ctx
      ) => {
        return ctx.prisma.record.create({
          data: {
            amount,
            description,
            expenseType: 'OUT',
            recordLabels: {
              create: labelIds?.map((id) => ({
                label: {
                  connect: {
                    id,
                  },
                },
              })),
            },
            timestamp,
            category: { connect: { id: Number(categoryId) } },
            account: { connect: { id: Number(accountId) } },
          },
        });
      },
    });

    t.field('createCategory', {
      type: 'Category',
      args: {
        name: stringArg({ nullable: false }),
        icon: stringArg(),
        expenseType: stringArg({ nullable: false, default: 'OUT' }),
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

import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { mutationType, stringArg, floatArg, intArg } from 'nexus';
import { APP_SECRET, getUserId } from '../utils';

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const hashedPassword = await hash(password, 10);
        const user = await ctx.prisma.user.create({
          data: {
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
        balance: floatArg({ default: 0 }),
        name: stringArg({ nullable: false }),
        currency: stringArg({ nullable: false }),
        color: stringArg({ nullable: false }),
      },
      resolve: (_, { balance, name, currency, color }, ctx) => {
        const userId = getUserId(ctx);

        if (!userId) throw new Error('Could not authenticate user.');

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
        account: intArg({ nullable: false }),
        amount: floatArg({ default: 0 }),
        category: stringArg({ nullable: false }),
        description: stringArg({ default: '' }),
      },
      resolve: (_, { amount, category, description, account }, ctx) => {
        const userId = getUserId(ctx);

        if (!userId) throw new Error('Could not authenticate user.');

        return ctx.prisma.record.create({
          data: {
            amount,
            category,
            description,
            account: { connect: { id: Number(account) } },
          },
        });
      },
    });
  },
});

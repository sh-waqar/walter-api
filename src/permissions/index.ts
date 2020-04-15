import { rule, and, shield } from 'graphql-shield';
import { getUserId } from '../utils';

const isAuthenticatedUser = rule()((_, __, ctx) => {
  const userId = getUserId(ctx);
  return Boolean(userId);
});

const isAccountOwner = rule()(async (_, { accountId }, ctx) => {
  const userId = getUserId(ctx);

  const user = await ctx.prisma.account
    .findOne({
      where: {
        id: Number(accountId),
      },
    })
    .user();

  return userId === user.id;
});

export const permissions = shield(
  {
    Query: {
      me: isAuthenticatedUser,
      accounts: isAuthenticatedUser,
      records: and(isAuthenticatedUser, isAccountOwner),
      labels: isAuthenticatedUser,
    },
    Mutation: {
      createAccount: isAuthenticatedUser,
      createRecord: and(isAuthenticatedUser, isAccountOwner),
      createCategory: isAuthenticatedUser,
      createLabel: isAuthenticatedUser,
    },
  },
  {
    debug: true,
  }
);

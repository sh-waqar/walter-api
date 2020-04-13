import { rule, shield } from 'graphql-shield';
import { getUserId } from '../utils';

const rules = {
  isAuthenticatedUser: rule()((_, __, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  })
};

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    accounts: rules.isAuthenticatedUser
  }
});

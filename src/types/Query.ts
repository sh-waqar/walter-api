import { intArg, queryType } from 'nexus';
import { getUserId } from '../utils';

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (_, __, ctx) => {
        const userId = getUserId(ctx);
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId)
          }
        });
      }
    });

    t.list.field('accounts', {
      type: 'Account',
      nullable: false,
      resolve: (_, __, ctx) => {
        const userId = getUserId(ctx);
        return ctx.prisma.account.findMany({
          where: {
            userId: Number(userId)
          }
        });
      }
    });
  }
});

import { objectType } from 'nexus';

export const Record = objectType({
  name: 'Record',
  definition(t) {
    t.model.id();
    t.model.amount();
    t.model.categoryId();
    t.model.category();
    t.model.accountId();
    t.model.account();
  },
});

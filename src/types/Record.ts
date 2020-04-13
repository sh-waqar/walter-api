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
    t.model.timestamp();
    t.model.recordLabels();
    t.model.expenseType();
    t.model.description();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

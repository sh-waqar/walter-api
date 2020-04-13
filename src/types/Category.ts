import { objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.expenseType();
    t.model.icon();
    t.model.userId();
  },
});

import { objectType } from 'nexus';

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.model.id();
    t.model.balance();
    t.model.color();
    t.model.currency();
    t.model.name();
    t.model.userId();
    t.model.records();
  },
});

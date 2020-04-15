import { objectType } from 'nexus';

export const Label = objectType({
  name: 'Label',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.color();
    t.model.userId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

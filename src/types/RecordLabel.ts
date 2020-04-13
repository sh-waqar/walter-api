import { objectType } from 'nexus';

export const RecordLabel = objectType({
  name: 'RecordLabel',
  definition(t) {
    t.model.id();
    t.model.labelId();
    t.model.recordId();
    t.model.label();
    t.model.record();
  },
});

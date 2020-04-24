import { enumType } from 'nexus';

export const ExpenseType = enumType({
  name: 'ExpenseType',
  members: ['IN', 'OUT', 'TRANSFER'],
});

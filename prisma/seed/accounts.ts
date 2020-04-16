// @ts-nocheck
import { getColor, getAmount } from './utils';

export const generateAccounts = (users) =>
  users.flatMap((user) => [
    {
      name: `${user.name} - Account A`,
      balance: getAmount(500),
      color: getColor(),
      currency: 'EUR',
      user: {
        connect: {
          id: Number(user.id),
        },
      },
    },
    {
      name: `${user.name} - Account B`,
      balance: getAmount(500),
      color: getColor(),
      currency: 'EUR',
      user: {
        connect: {
          id: Number(user.id),
        },
      },
    },
  ]);

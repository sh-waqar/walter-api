// @ts-nocheck
import { getAmount } from './utils';

const getDate = () => {
  const dates = [
    '2020-03-26 02:39:23',
    '2020-02-11 06:56:00',
    '2020-01-29 20:29:39',
    '2020-01-04 01:04:57',
    '2020-02-14 08:18:57',
    '2020-04-02 19:47:37',
    '2020-03-13 20:13:41',
    '2020-03-16 16:45:16',
    '2020-03-04 02:58:36',
    '2020-01-21 10:46:35',
  ];
  const date = dates[Math.floor(Math.random() * dates.length)];

  return new Date(date).toISOString();
};

export const generateRecords = (accounts, categories) => {
  return accounts.flatMap((account) => [
    {
      description: `${account.name} - Record A`,
      amount: getAmount(50),
      expenseType: 'OUT',
      timestamp: getDate(),
      account: {
        connect: {
          id: Number(account.id),
        },
      },
      category: {
        connect: {
          id: Number(categories[2].id),
        },
      },
    },
    {
      description: `${account.name} - Record B`,
      amount: getAmount(50),
      expenseType: 'OUT',
      timestamp: getDate(),
      account: {
        connect: {
          id: Number(account.id),
        },
      },
      category: {
        connect: {
          id: Number(categories[4].id),
        },
      },
    },
    {
      description: `${account.name} - Record C`,
      amount: getAmount(50),
      expenseType: 'OUT',
      timestamp: getDate(),
      account: {
        connect: {
          id: Number(account.id),
        },
      },
      category: {
        connect: {
          id: Number(categories[3].id),
        },
      },
    },
    {
      description: `${account.name} - Record D`,
      amount: getAmount(50),
      expenseType: 'IN',
      timestamp: getDate(),
      account: {
        connect: {
          id: Number(account.id),
        },
      },
      category: {
        connect: {
          id: Number(categories[25].id),
        },
      },
    },
  ]);
};

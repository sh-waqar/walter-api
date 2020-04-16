// @ts-nocheck

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import users from './users';
import categories from './categories';
import { generateAccounts } from './accounts';
import { generateRecords } from './records';

async function main() {
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  );

  const accounts = generateAccounts(createdUsers);
  const createdAccounts = await Promise.all(
    accounts.map((account) =>
      prisma.account.create({
        data: account,
      })
    )
  );

  const records = generateRecords(createdAccounts, createdCategories);
  await Promise.all(
    records.map((record) =>
      prisma.record.create({
        data: record,
      })
    )
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
    console.log('👍 Done seeding the database!');

    process.exit();
  });

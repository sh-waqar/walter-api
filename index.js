import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.accounts.findMany();
  console.log(accounts);
}

main()
  .catch(e => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.disconnect();
  });

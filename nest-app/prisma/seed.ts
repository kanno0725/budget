import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // すべて削除
  await prisma.payments.deleteMany();
  await prisma.paymentCategories.deleteMany();
  await prisma.users.deleteMany();
  await prisma.userGroups.deleteMany();
  // 挿入
  const ug1 = await prisma.userGroups.create({
    data: {
      name: 't1',
    },
  });
  const u1 = await prisma.users.create({
    data: {
      name: 'john',
      isDeleted: false,
      loginId: 't1',
      password: 't',
      userGroupId: ug1.id,
      themeColor: '#ffffff',
    },
  });
  const u2 = await prisma.users.create({
    data: {
      name: 'user1',
      isDeleted: false,
      loginId: 't2',
      password: 't',
      userGroupId: ug1.id,
      themeColor: '#ffffff',
    },
  });
  const pc1 = await prisma.paymentCategories.create({
    data: {
      name: '食費',
      isDeleted: false,
      userGroupId: ug1.id,
      color: '#454511',
    },
  });
  await prisma.payments.create({
    data: {
      name: 'パン',
      isDeleted: false,
      price: 150,
      paymentDatetime: '2024-12-14T18:47:59+09:00',
      paymentCategoryId: pc1.id,
      paymentUserId: u1.id,
      loadRate: 50,
    },
  });
  await prisma.payments.create({
    data: {
      name: 'お茶',
      isDeleted: false,
      price: 100,
      paymentDatetime: '2024-12-04T18:47:59+09:00',
      paymentCategoryId: pc1.id,
      paymentUserId: u2.id,
      loadRate: 50,
    },
  });
  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

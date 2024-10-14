import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

// const userData: Prisma.UserCreateInput[] = [
//     {
//         name: 'hoge1',
//         email: 'hoge1@example.com',
//     },
//     {
//         name: 'hoge2',
//         email: 'hoge2@example.com',
//     },
//     {
//         name: 'hoge3',
//         email: 'hoge3@example.com',
//     },
// ]

// async function main() {
//   console.log(`Start seeding ...`);

//   await prisma.post.deleteMany();

//   for (const p of postData) {
//     const post = await prisma.post.create({
//       data: p,
//     });

//     console.log(`Created post with id: ${post.id}`);
//   }

//   console.log(`Seeding finished.`);
// }

async function main() {
  await prisma.userGroups.deleteMany();
  console.log(`Start seeding ...`);
  prisma.userGroups.create({
    data: {
      name: 'g1',
    },
  });
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

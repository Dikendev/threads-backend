import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serviceData: Prisma.UserCreateInput[] = [
  {
    name: 'Diego',
  },
  {
    name: 'Cristina',
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const user of serviceData) {
    const service = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id:${service.id}`);
  }

  console.log(`Seeding finished`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

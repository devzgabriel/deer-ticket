import { PrismaClient } from '.prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeed');

async function main() {
  await prisma.skill.createMany({
    data: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'Prisma' },
      { name: 'TypeScript' },
      { name: 'Figma' },
      { name: 'Framer' },
      { name: 'Business' },
    ],
  });

  logger.log('Prisma seed done!');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

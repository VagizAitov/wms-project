import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password
    },
  });

  await prisma.warehouse.createMany({
    data: [
      { name: 'Main Warehouse', location: 'A1' },
      { name: 'Secondary Warehouse', location: 'B1' },
    ],
  });

  await prisma.product.create({
    data: {
      name: 'Test Product',
      barcode: '123456789',
      category: 'test',
    },
  });
}

main();
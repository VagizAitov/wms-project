import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StocksService {
  constructor(private prisma: PrismaService) {}

  // 📦 Получить остаток по товару и складу
  async getStock(productId: string, warehouseId: string) {
    const stock = await this.prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    return stock || { quantity: 0 };
  }

  // 📦 Получить все остатки по складу
  async getWarehouseStocks(warehouseId: string) {
    return this.prisma.stock.findMany({
      where: { warehouseId },
      include: {
        product: true,
      },
    });
  }

  // 📦 Получить все остатки по товару
  async getProductStocks(productId: string) {
    return this.prisma.stock.findMany({
      where: { productId },
      include: {
        warehouse: true,
      },
    });
  }

  // ⚙️ INTERNAL: увеличить остаток
  async increaseStock(productId: string, warehouseId: string, quantity: number) {
    return this.prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        productId,
        warehouseId,
        quantity,
      },
    });
  }

  // ⚙️ INTERNAL: уменьшить остаток
  async decreaseStock(productId: string, warehouseId: string, quantity: number) {
    const stock = await this.getStock(productId, warehouseId);

    if (stock.quantity < quantity) {
      throw new NotFoundException('Недостаточно товара на складе');
    }

    return this.prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }
}
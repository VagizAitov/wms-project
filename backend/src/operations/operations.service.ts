import {
  BadRequestException,
  Injectable,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StocksService } from '../stocks/stocks.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationType } from '@prisma/client';

@Injectable()
export class OperationsService {
  
  private readonly logger = new Logger(OperationsService.name);

  constructor(
    private prisma: PrismaService,
    private stocksService: StocksService,
  ) {}

  async create(dto: CreateOperationDto, userId: string) {
    const { type, productId, quantity, fromWarehouseId, toWarehouseId } = dto;

    switch (type) {
      case OperationType.IN:
        if (!toWarehouseId) {
          throw new BadRequestException('toWarehouseId обязателен для IN');
        }

        return this.prisma.$transaction(async (tx) => {
          this.logger.log(`User ${userId} performed ${type} operation`);
          await tx.stock.upsert({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: toWarehouseId,
              },
            },
            update: {
              quantity: { increment: quantity },
            },
            create: {
              productId,
              warehouseId: toWarehouseId,
              quantity,
            },
          });

          return tx.operation.create({
            data: {
              type,
              productId,
              quantity,
              toWarehouseId,
              userId,
            },
          });
        });

      case OperationType.OUT:
        if (!fromWarehouseId) {
          throw new BadRequestException('fromWarehouseId обязателен для OUT');
        }

        return this.prisma.$transaction(async (tx) => {
          const stock = await tx.stock.findUnique({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: fromWarehouseId,
              },
            },
          });

          if (!stock || stock.quantity < quantity) {
            throw new BadRequestException('Недостаточно товара');
          }

          await tx.stock.update({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: fromWarehouseId,
              },
            },
            data: {
              quantity: { decrement: quantity },
            },
          });

          return tx.operation.create({
            data: {
              type,
              productId,
              quantity,
              fromWarehouseId,
              userId,
            },
          });
        });

      case OperationType.TRANSFER:
        if (!fromWarehouseId || !toWarehouseId) {
          throw new BadRequestException('Нужны оба склада для TRANSFER');
        }

        if (fromWarehouseId === toWarehouseId) {
          throw new BadRequestException('Склады не могут совпадать');
        }

        return this.prisma.$transaction(async (tx) => {
          const stock = await tx.stock.findUnique({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: fromWarehouseId,
              },
            },
          });

          if (!stock || stock.quantity < quantity) {
            throw new BadRequestException('Недостаточно товара');
          }

          // списание
          await tx.stock.update({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: fromWarehouseId,
              },
            },
            data: {
              quantity: { decrement: quantity },
            },
          });

          // приход
          await tx.stock.upsert({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: toWarehouseId,
              },
            },
            update: {
              quantity: { increment: quantity },
            },
            create: {
              productId,
              warehouseId: toWarehouseId,
              quantity,
            },
          });

          return tx.operation.create({
            data: {
              type,
              productId,
              quantity,
              fromWarehouseId,
              toWarehouseId,
              userId,
            },
          });
        });

      default:
        throw new BadRequestException('Неверный тип операции');
    }
  }
}
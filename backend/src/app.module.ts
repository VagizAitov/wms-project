import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StocksModule } from './stocks/stocks.module';
import { OperationsModule } from './operations/operations.module';

@Module({
  imports: [AuthModule, PrismaModule, ProductsModule, WarehousesModule, StocksModule, OperationsModule], 
})
export class AppModule {}
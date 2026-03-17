import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [PrismaModule, StocksModule],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
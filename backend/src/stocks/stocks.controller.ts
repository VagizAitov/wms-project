import { Controller, Get, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  // 📦 Остаток конкретного товара на складе
  @Get('single')
  getStock(
    @Query('productId') productId: string,
    @Query('warehouseId') warehouseId: string,
  ) {
    return this.stocksService.getStock(productId, warehouseId);
  }

  // 📦 Все остатки склада
  @Get('warehouse')
  getWarehouseStocks(@Query('warehouseId') warehouseId: string) {
    return this.stocksService.getWarehouseStocks(warehouseId);
  }

  // 📦 Все остатки товара
  @Get('product')
  getProductStocks(@Query('productId') productId: string) {
    return this.stocksService.getProductStocks(productId);
  }
}
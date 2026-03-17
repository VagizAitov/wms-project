import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Post, Body } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    @Get()
    findAll() {
        return this.productsService.findAll();
    }
    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }
    @Get('barcode/:barcode')
    findByBarcode(@Param('barcode') barcode: string) {
        return this.productsService.findByBarcode(barcode);
    }
}
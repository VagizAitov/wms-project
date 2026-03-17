import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { generateBarcode } from 'src/utils/generate-barcode';
import { NotFoundException, Logger } from '@nestjs/common';

@Injectable()
export class ProductsService {

    private readonly logger = new Logger(ProductsService.name);

    constructor(private prisma: PrismaService) {}
    // -- СОЗДАТЬ ПРОДУКТ
    async create(dto: CreateProductDto) {
        let barcode: string = '';
        let exists = true;

        while (exists) {
            barcode = generateBarcode();

            const found = await this.prisma.product.findUnique({
            where: { barcode },
            });

            if (!found) exists = false;
        } 

        return this.prisma.product.create({
            data: {
            ...dto,
            barcode,
            },
        });
    }
    // -- НАЙТИ ПО ШТРИХКОДУ
    async findByBarcode(barcode: string) {
        this.logger.log('Operation executed');
        const product = await this.prisma.product.findUnique({
            where: { barcode },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }
  findAll() {
    return this.prisma.product.findMany();
  }
}

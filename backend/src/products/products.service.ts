import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        // Check if product code already exists
        const existingProduct = await this.prisma.product.findUnique({
            where: { code: createProductDto.code },
        });

        if (existingProduct) {
            throw new ConflictException('Product code already exists');
        }

        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                materials: {
                    include: {
                        rawMaterial: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                materials: {
                    include: {
                        rawMaterial: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Check if product exists
        await this.findOne(id);

        // Check if new code conflicts with existing product
        if (updateProductDto.code) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { code: updateProductDto.code },
            });

            if (existingProduct && existingProduct.id !== id) {
                throw new ConflictException('Product code already exists');
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string) {
        // Check if product exists
        await this.findOne(id);

        return this.prisma.product.delete({
            where: { id },
        });
    }
}

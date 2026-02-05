import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductMaterialDto, UpdateProductMaterialDto } from './dto';

@Injectable()
export class ProductMaterialsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(productId: string, createDto: CreateProductMaterialDto) {
        // Validate product exists
        await this.validateProductExists(productId);

        // Validate raw material exists
        await this.validateRawMaterialExists(createDto.rawMaterialId);

        // Check if association already exists
        const existing = await this.prisma.productMaterial.findUnique({
            where: {
                productId_rawMaterialId: {
                    productId,
                    rawMaterialId: createDto.rawMaterialId,
                },
            },
        });

        if (existing) {
            throw new ConflictException(
                'This material is already associated with the product',
            );
        }

        return this.prisma.productMaterial.create({
            data: {
                productId,
                rawMaterialId: createDto.rawMaterialId,
                quantityNeeded: createDto.quantityNeeded,
            },
            include: {
                rawMaterial: true,
            },
        });
    }

    async findAllByProduct(productId: string) {
        // Validate product exists
        await this.validateProductExists(productId);

        return this.prisma.productMaterial.findMany({
            where: { productId },
            include: {
                rawMaterial: true,
            },
        });
    }

    async update(
        productId: string,
        rawMaterialId: string,
        updateDto: UpdateProductMaterialDto,
    ) {
        // Validate product exists
        await this.validateProductExists(productId);

        // Find the association
        const association = await this.prisma.productMaterial.findUnique({
            where: {
                productId_rawMaterialId: {
                    productId,
                    rawMaterialId,
                },
            },
        });

        if (!association) {
            throw new NotFoundException('Product-material association not found');
        }

        return this.prisma.productMaterial.update({
            where: { id: association.id },
            data: { quantityNeeded: updateDto.quantityNeeded },
            include: {
                rawMaterial: true,
            },
        });
    }

    async remove(productId: string, rawMaterialId: string) {
        // Validate product exists
        await this.validateProductExists(productId);

        // Find the association
        const association = await this.prisma.productMaterial.findUnique({
            where: {
                productId_rawMaterialId: {
                    productId,
                    rawMaterialId,
                },
            },
        });

        if (!association) {
            throw new NotFoundException('Product-material association not found');
        }

        return this.prisma.productMaterial.delete({
            where: { id: association.id },
        });
    }

    private async validateProductExists(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }
    }

    private async validateRawMaterialExists(rawMaterialId: string) {
        const material = await this.prisma.rawMaterial.findUnique({
            where: { id: rawMaterialId },
        });

        if (!material) {
            throw new NotFoundException(
                `Raw material with ID ${rawMaterialId} not found`,
            );
        }
    }
}

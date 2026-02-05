import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRawMaterialDto, UpdateRawMaterialDto } from './dto';

@Injectable()
export class RawMaterialsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createRawMaterialDto: CreateRawMaterialDto) {
        // Check if material code already exists
        const existingMaterial = await this.prisma.rawMaterial.findUnique({
            where: { code: createRawMaterialDto.code },
        });

        if (existingMaterial) {
            throw new ConflictException('Material code already exists');
        }

        return this.prisma.rawMaterial.create({
            data: createRawMaterialDto,
        });
    }

    async findAll() {
        return this.prisma.rawMaterial.findMany({
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const material = await this.prisma.rawMaterial.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!material) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }

        return material;
    }

    async update(id: string, updateRawMaterialDto: UpdateRawMaterialDto) {
        // Check if material exists
        await this.findOne(id);

        // Check if new code conflicts with existing material
        if (updateRawMaterialDto.code) {
            const existingMaterial = await this.prisma.rawMaterial.findUnique({
                where: { code: updateRawMaterialDto.code },
            });

            if (existingMaterial && existingMaterial.id !== id) {
                throw new ConflictException('Material code already exists');
            }
        }

        return this.prisma.rawMaterial.update({
            where: { id },
            data: updateRawMaterialDto,
        });
    }

    async remove(id: string) {
        // Check if material exists and get usage count
        const material = await this.findOne(id);

        return this.prisma.rawMaterial.delete({
            where: { id },
        });
    }

    async updateStock(id: string, quantity: number) {
        // Validate material exists
        await this.findOne(id);

        return this.prisma.rawMaterial.update({
            where: { id },
            data: { quantityInStock: quantity },
        });
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialsService } from './raw-materials.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('RawMaterialsService', () => {
    let service: RawMaterialsService;
    let prisma: {
        rawMaterial: {
            findMany: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
            delete: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            rawMaterial: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RawMaterialsService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<RawMaterialsService>(RawMaterialsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of raw materials', async () => {
            const mockMaterials = [
                { id: '1', code: 'RM001', name: 'Material 1', quantityInStock: 100, unit: 'un' },
                { id: '2', code: 'RM002', name: 'Material 2', quantityInStock: 200, unit: 'un' },
            ];
            prisma.rawMaterial.findMany.mockResolvedValue(mockMaterials);

            const result = await service.findAll();

            expect(result).toEqual(mockMaterials);
            expect(prisma.rawMaterial.findMany).toHaveBeenCalledWith({
                include: { products: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('findOne', () => {
        it('should return a raw material by id', async () => {
            const mockMaterial = {
                id: '1',
                code: 'RM001',
                name: 'Material 1',
                quantityInStock: 100,
                unit: 'un',
            };
            prisma.rawMaterial.findUnique.mockResolvedValue(mockMaterial);

            const result = await service.findOne('1');

            expect(result).toEqual(mockMaterial);
        });

        it('should throw NotFoundException when material not found', async () => {
            prisma.rawMaterial.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should create and return a new raw material', async () => {
            const createDto = { code: 'RM001', name: 'New Material', quantityInStock: 50, unit: 'un' };
            const expectedMaterial = { id: '1', ...createDto };

            prisma.rawMaterial.findUnique.mockResolvedValue(null);
            prisma.rawMaterial.create.mockResolvedValue(expectedMaterial);

            const result = await service.create(createDto);

            expect(result).toEqual(expectedMaterial);
            expect(prisma.rawMaterial.create).toHaveBeenCalledWith({
                data: createDto,
            });
        });

        it('should throw ConflictException when code already exists', async () => {
            const createDto = { code: 'RM001', name: 'New Material', quantityInStock: 50 };
            prisma.rawMaterial.findUnique.mockResolvedValue({ id: 'existing', ...createDto });

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('update', () => {
        it('should update and return the raw material', async () => {
            const updateDto = { quantityInStock: 200 };
            const existingMaterial = { id: '1', code: 'RM001', name: 'Material', quantityInStock: 100, unit: 'un' };
            const updatedMaterial = { ...existingMaterial, ...updateDto };

            prisma.rawMaterial.findUnique.mockResolvedValue(existingMaterial);
            prisma.rawMaterial.update.mockResolvedValue(updatedMaterial);

            const result = await service.update('1', updateDto);

            expect(result.quantityInStock).toBe(200);
        });

        it('should throw ConflictException when updating to existing code of another material', async () => {
            const existingMaterial = { id: '1', code: 'RM001', name: 'Material 1', unit: 'un' };
            const otherMaterial = { id: '2', code: 'RM002', name: 'Material 2', unit: 'un' };

            prisma.rawMaterial.findUnique
                .mockResolvedValueOnce(existingMaterial) // findOne call
                .mockResolvedValueOnce(otherMaterial); // conflict check call

            await expect(service.update('1', { code: 'RM002' })).rejects.toThrow(ConflictException);
        });
    });

    describe('remove', () => {
        it('should delete the raw material', async () => {
            const mockMaterial = { id: '1', code: 'RM001', name: 'Material 1', quantityInStock: 100, unit: 'un' };
            prisma.rawMaterial.findUnique.mockResolvedValue(mockMaterial);
            prisma.rawMaterial.delete.mockResolvedValue(mockMaterial);

            await service.remove('1');

            expect(prisma.rawMaterial.delete).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw NotFoundException when material not found', async () => {
            prisma.rawMaterial.findUnique.mockResolvedValue(null);

            await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateStock', () => {
        it('should update stock quantity', async () => {
            const existingMaterial = { id: '1', code: 'RM001', name: 'Material', quantityInStock: 100, unit: 'un' };
            const updatedMaterial = { ...existingMaterial, quantityInStock: 150 };

            prisma.rawMaterial.findUnique.mockResolvedValue(existingMaterial);
            prisma.rawMaterial.update.mockResolvedValue(updatedMaterial);

            const result = await service.updateStock('1', 150);

            expect(result.quantityInStock).toBe(150);
            expect(prisma.rawMaterial.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { quantityInStock: 150 },
            });
        });

        it('should throw NotFoundException when material not found', async () => {
            prisma.rawMaterial.findUnique.mockResolvedValue(null);

            await expect(service.updateStock('nonexistent', 150)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});

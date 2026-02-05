import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProductsService', () => {
    let service: ProductsService;
    let prisma: {
        product: {
            findMany: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
            delete: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            product: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const mockProducts = [
                { id: '1', code: 'PROD001', name: 'Product 1', value: 100 },
                { id: '2', code: 'PROD002', name: 'Product 2', value: 200 },
            ];
            prisma.product.findMany.mockResolvedValue(mockProducts);

            const result = await service.findAll();

            expect(result).toEqual(mockProducts);
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                include: { materials: { include: { rawMaterial: true } } },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should return empty array when no products exist', async () => {
            prisma.product.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            const mockProduct = {
                id: '1',
                code: 'PROD001',
                name: 'Product 1',
                value: 100,
                materials: [],
            };
            prisma.product.findUnique.mockResolvedValue(mockProduct);

            const result = await service.findOne('1');

            expect(result).toEqual(mockProduct);
            expect(prisma.product.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                include: { materials: { include: { rawMaterial: true } } },
            });
        });

        it('should throw NotFoundException when product not found', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should create and return a new product', async () => {
            const createDto = { code: 'PROD001', name: 'New Product', value: 150 };
            const expectedProduct = { id: '1', ...createDto, createdAt: new Date(), updatedAt: new Date() };

            prisma.product.findUnique.mockResolvedValue(null); // No duplicate
            prisma.product.create.mockResolvedValue(expectedProduct);

            const result = await service.create(createDto);

            expect(result).toEqual(expectedProduct);
            expect(prisma.product.create).toHaveBeenCalledWith({
                data: createDto,
            });
        });

        it('should throw ConflictException when code already exists', async () => {
            const createDto = { code: 'PROD001', name: 'New Product', value: 150 };
            prisma.product.findUnique.mockResolvedValue({ id: 'existing', ...createDto });

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('update', () => {
        it('should update and return the product', async () => {
            const updateDto = { name: 'Updated Name' };
            const existingProduct = { id: '1', code: 'PROD001', name: 'Old Name', value: 100, materials: [] };
            const updatedProduct = { ...existingProduct, ...updateDto };

            prisma.product.findUnique.mockResolvedValue(existingProduct);
            prisma.product.update.mockResolvedValue(updatedProduct);

            const result = await service.update('1', updateDto);

            expect(result.name).toBe('Updated Name');
        });

        it('should throw NotFoundException when product not found', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(service.update('nonexistent', { name: 'Test' })).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw ConflictException when updating to existing code', async () => {
            const existingProduct = { id: '1', code: 'PROD001', name: 'Product', value: 100, materials: [] };
            const otherProduct = { id: '2', code: 'PROD002', name: 'Other', value: 200, materials: [] };

            prisma.product.findUnique
                .mockResolvedValueOnce(existingProduct) // First call: findOne
                .mockResolvedValueOnce(otherProduct); // Second call: check code uniqueness

            await expect(service.update('1', { code: 'PROD002' })).rejects.toThrow(ConflictException);
        });
    });

    describe('remove', () => {
        it('should delete the product', async () => {
            const mockProduct = { id: '1', code: 'PROD001', name: 'Product 1', value: 100, materials: [] };
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.product.delete.mockResolvedValue(mockProduct);

            await service.remove('1');

            expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw NotFoundException when product not found', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });
});

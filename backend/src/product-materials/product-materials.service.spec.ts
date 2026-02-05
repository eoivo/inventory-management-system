import { Test, TestingModule } from '@nestjs/testing';
import { ProductMaterialsService } from './product-materials.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProductMaterialsService', () => {
    let service: ProductMaterialsService;
    let prisma: {
        product: {
            findUnique: jest.Mock;
        };
        rawMaterial: {
            findUnique: jest.Mock;
        };
        productMaterial: {
            findMany: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
            delete: jest.Mock;
        };
    };

    const mockProduct = { id: 'product-1', code: 'PROD001', name: 'Product 1' };
    const mockRawMaterial = { id: 'material-1', code: 'RM001', name: 'Material 1', quantityInStock: 100 };
    const mockAssociation = {
        id: 'assoc-1',
        productId: 'product-1',
        rawMaterialId: 'material-1',
        quantityNeeded: 5,
        rawMaterial: mockRawMaterial,
    };

    beforeEach(async () => {
        prisma = {
            product: {
                findUnique: jest.fn(),
            },
            rawMaterial: {
                findUnique: jest.fn(),
            },
            productMaterial: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductMaterialsService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<ProductMaterialsService>(ProductMaterialsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a product-material association', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.rawMaterial.findUnique.mockResolvedValue(mockRawMaterial);
            prisma.productMaterial.findUnique.mockResolvedValue(null);
            prisma.productMaterial.create.mockResolvedValue(mockAssociation);

            const result = await service.create('product-1', {
                rawMaterialId: 'material-1',
                quantityNeeded: 5,
            });

            expect(result).toEqual(mockAssociation);
            expect(prisma.productMaterial.create).toHaveBeenCalledWith({
                data: {
                    productId: 'product-1',
                    rawMaterialId: 'material-1',
                    quantityNeeded: 5,
                },
                include: { rawMaterial: true },
            });
        });

        it('should throw NotFoundException when product does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(
                service.create('nonexistent', {
                    rawMaterialId: 'material-1',
                    quantityNeeded: 5,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when raw material does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.rawMaterial.findUnique.mockResolvedValue(null);

            await expect(
                service.create('product-1', {
                    rawMaterialId: 'nonexistent',
                    quantityNeeded: 5,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when association already exists', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.rawMaterial.findUnique.mockResolvedValue(mockRawMaterial);
            prisma.productMaterial.findUnique.mockResolvedValue(mockAssociation);

            await expect(
                service.create('product-1', {
                    rawMaterialId: 'material-1',
                    quantityNeeded: 5,
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findAllByProduct', () => {
        it('should return all materials for a product', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findMany.mockResolvedValue([mockAssociation]);

            const result = await service.findAllByProduct('product-1');

            expect(result).toEqual([mockAssociation]);
            expect(prisma.productMaterial.findMany).toHaveBeenCalledWith({
                where: { productId: 'product-1' },
                include: { rawMaterial: true },
            });
        });

        it('should return empty array when no materials are associated', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findMany.mockResolvedValue([]);

            const result = await service.findAllByProduct('product-1');

            expect(result).toEqual([]);
        });

        it('should throw NotFoundException when product does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(service.findAllByProduct('nonexistent')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update the quantity needed', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findUnique.mockResolvedValue(mockAssociation);
            prisma.productMaterial.update.mockResolvedValue({
                ...mockAssociation,
                quantityNeeded: 10,
            });

            const result = await service.update('product-1', 'material-1', {
                quantityNeeded: 10,
            });

            expect(result.quantityNeeded).toBe(10);
            expect(prisma.productMaterial.update).toHaveBeenCalledWith({
                where: { id: 'assoc-1' },
                data: { quantityNeeded: 10 },
                include: { rawMaterial: true },
            });
        });

        it('should throw NotFoundException when product does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(
                service.update('nonexistent', 'material-1', { quantityNeeded: 10 }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when association does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findUnique.mockResolvedValue(null);

            await expect(
                service.update('product-1', 'material-1', { quantityNeeded: 10 }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete the association', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findUnique.mockResolvedValue(mockAssociation);
            prisma.productMaterial.delete.mockResolvedValue(mockAssociation);

            await service.remove('product-1', 'material-1');

            expect(prisma.productMaterial.delete).toHaveBeenCalledWith({
                where: { id: 'assoc-1' },
            });
        });

        it('should throw NotFoundException when product does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            await expect(service.remove('nonexistent', 'material-1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException when association does not exist', async () => {
            prisma.product.findUnique.mockResolvedValue(mockProduct);
            prisma.productMaterial.findUnique.mockResolvedValue(null);

            await expect(service.remove('product-1', 'material-1')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});

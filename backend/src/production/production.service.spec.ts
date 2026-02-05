import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from './production.service';
import { PrismaService } from '../database/prisma.service';

describe('ProductionService', () => {
    let service: ProductionService;
    let prisma: {
        product: {
            findMany: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            product: {
                findMany: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductionService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<ProductionService>(ProductionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateProductionSuggestions', () => {
        it('should return empty suggestions when no products exist', async () => {
            prisma.product.findMany.mockResolvedValue([]);

            const result = await service.calculateProductionSuggestions();

            expect(result.suggestions).toEqual([]);
            expect(result.totalProductionValue).toBe(0);
            expect(result.timestamp).toBeDefined();
        });

        it('should return empty suggestions when products have no materials', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-1',
                    code: 'PROD001',
                    name: 'Product Without Materials',
                    value: 100,
                    materials: [],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            expect(result.suggestions).toEqual([]);
            expect(result.totalProductionValue).toBe(0);
        });

        it('should calculate correct quantity based on material constraints', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-1',
                    code: 'PROD001',
                    name: 'Test Product',
                    value: 50,
                    materials: [
                        {
                            quantityNeeded: 2,
                            rawMaterialId: 'mat-1',
                            rawMaterial: {
                                id: 'mat-1',
                                code: 'RM001',
                                name: 'Material A',
                                quantityInStock: 100,
                            },
                        },
                        {
                            quantityNeeded: 3,
                            rawMaterialId: 'mat-2',
                            rawMaterial: {
                                id: 'mat-2',
                                code: 'RM002',
                                name: 'Material B',
                                quantityInStock: 120,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            // Material A: 100/2 = 50 units
            // Material B: 120/3 = 40 units
            // Limiting factor: 40 units
            expect(result.suggestions).toHaveLength(1);
            expect(result.suggestions[0].quantityToProduce).toBe(40);
            expect(result.suggestions[0].totalValue).toBe(40 * 50);
            expect(result.totalProductionValue).toBe(2000);
        });

        it('should prioritize products by higher unit value', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'low-value',
                    code: 'PROD001',
                    name: 'Low Value Product',
                    value: 10,
                    materials: [
                        {
                            quantityNeeded: 1,
                            rawMaterialId: 'shared-mat',
                            rawMaterial: {
                                id: 'shared-mat',
                                code: 'RM001',
                                name: 'Shared Material',
                                quantityInStock: 100,
                            },
                        },
                    ],
                },
                {
                    id: 'high-value',
                    code: 'PROD002',
                    name: 'High Value Product',
                    value: 100,
                    materials: [
                        {
                            quantityNeeded: 1,
                            rawMaterialId: 'shared-mat',
                            rawMaterial: {
                                id: 'shared-mat',
                                code: 'RM001',
                                name: 'Shared Material',
                                quantityInStock: 100,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            // High value product should be first and get all materials
            expect(result.suggestions).toHaveLength(1);
            expect(result.suggestions[0].productId).toBe('high-value');
            expect(result.suggestions[0].quantityToProduce).toBe(100);
            expect(result.suggestions[0].totalValue).toBe(10000);
            expect(result.totalProductionValue).toBe(10000);
        });

        it('should sort by code alphabetically when unit values are equal', async () => {
            const sharedMaterial = {
                id: 'shared-mat',
                code: 'RM001',
                name: 'Shared Material',
                quantityInStock: 300,
            };

            const limitingMaterial = {
                id: 'limit-mat',
                code: 'RM-LIMIT',
                name: 'Limiter',
                quantityInStock: 100,
            };

            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-b',
                    code: 'PROD-B',
                    name: 'Product B',
                    value: 50,
                    materials: [
                        { quantityNeeded: 1, rawMaterialId: 'shared-mat', rawMaterial: sharedMaterial }
                    ],
                },
                {
                    id: 'product-a',
                    code: 'PROD-A',
                    name: 'Product A',
                    value: 50,
                    materials: [
                        { quantityNeeded: 1, rawMaterialId: 'shared-mat', rawMaterial: sharedMaterial },
                        { quantityNeeded: 1, rawMaterialId: 'limit-mat', rawMaterial: limitingMaterial }
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            // Product A is limited to 100 by limit-mat. 
            // Shared material has 300 total. 
            // Product A uses 100, leaving 200 for Product B.
            // Both should appear and be sorted by code PROD-A, then PROD-B.
            expect(result.suggestions).toHaveLength(2);
            expect(result.suggestions[0].productCode).toBe('PROD-A');
            expect(result.suggestions[1].productCode).toBe('PROD-B');
        });

        it('should allocate remaining materials to lower value products', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'high-value',
                    code: 'PROD001',
                    name: 'High Value Product',
                    value: 100,
                    materials: [
                        {
                            quantityNeeded: 5,
                            rawMaterialId: 'shared-mat',
                            rawMaterial: {
                                id: 'shared-mat',
                                code: 'RM001',
                                name: 'Shared Material',
                                quantityInStock: 100,
                            },
                        },
                    ],
                },
                {
                    id: 'low-value',
                    code: 'PROD002',
                    name: 'Low Value Product',
                    value: 10,
                    materials: [
                        {
                            quantityNeeded: 2,
                            rawMaterialId: 'shared-mat',
                            rawMaterial: {
                                id: 'shared-mat',
                                code: 'RM001',
                                name: 'Shared Material',
                                quantityInStock: 100,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            // High value: 100/5 = 20 units (uses 100 materials)
            // Low value: 0 remaining
            expect(result.suggestions).toHaveLength(1);
            expect(result.suggestions[0].productId).toBe('high-value');
            expect(result.suggestions[0].quantityToProduce).toBe(20);
            expect(result.totalProductionValue).toBe(2000);
        });

        it('should handle multiple products with different materials', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-a',
                    code: 'PRODA',
                    name: 'Product A',
                    value: 50,
                    materials: [
                        {
                            quantityNeeded: 2,
                            rawMaterialId: 'mat-exclusive-a',
                            rawMaterial: {
                                id: 'mat-exclusive-a',
                                code: 'RM_A',
                                name: 'Material A Only',
                                quantityInStock: 100,
                            },
                        },
                    ],
                },
                {
                    id: 'product-b',
                    code: 'PRODB',
                    name: 'Product B',
                    value: 30,
                    materials: [
                        {
                            quantityNeeded: 3,
                            rawMaterialId: 'mat-exclusive-b',
                            rawMaterial: {
                                id: 'mat-exclusive-b',
                                code: 'RM_B',
                                name: 'Material B Only',
                                quantityInStock: 120,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            // Both products can be produced independently
            expect(result.suggestions).toHaveLength(2);

            const productA = result.suggestions.find(s => s.productId === 'product-a');
            const productB = result.suggestions.find(s => s.productId === 'product-b');

            expect(productA?.quantityToProduce).toBe(50); // 100/2
            expect(productB?.quantityToProduce).toBe(40); // 120/3
            expect(result.totalProductionValue).toBe(50 * 50 + 40 * 30); // 2500 + 1200 = 3700
        });

        it('should return materials used correctly', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-1',
                    code: 'PROD001',
                    name: 'Test Product',
                    value: 100,
                    materials: [
                        {
                            quantityNeeded: 5,
                            rawMaterialId: 'mat-1',
                            rawMaterial: {
                                id: 'mat-1',
                                code: 'RM001',
                                name: 'Material A',
                                quantityInStock: 50,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            expect(result.suggestions[0].materialsUsed).toHaveLength(1);
            expect(result.suggestions[0].materialsUsed[0]).toEqual({
                rawMaterialId: 'mat-1',
                rawMaterialCode: 'RM001',
                rawMaterialName: 'Material A',
                quantityNeeded: 5,
                totalQuantityUsed: 50, // 10 units * 5 per unit
            });
        });

        it('should handle zero stock materials', async () => {
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-1',
                    code: 'PROD001',
                    name: 'Test Product',
                    value: 100,
                    materials: [
                        {
                            quantityNeeded: 5,
                            rawMaterialId: 'mat-1',
                            rawMaterial: {
                                id: 'mat-1',
                                code: 'RM001',
                                name: 'Empty Material',
                                quantityInStock: 0,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            expect(result.suggestions).toHaveLength(0);
            expect(result.totalProductionValue).toBe(0);
        });

        it('should handle Decimal values from Prisma', async () => {
            // Prisma Decimal objects implement valueOf for Number() conversion
            const decimalValue = {
                toNumber: () => 99.99,
                valueOf: () => 99.99,
            };
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 'product-1',
                    code: 'PROD001',
                    name: 'Test Product',
                    value: decimalValue,
                    materials: [
                        {
                            quantityNeeded: 1,
                            rawMaterialId: 'mat-1',
                            rawMaterial: {
                                id: 'mat-1',
                                code: 'RM001',
                                name: 'Material A',
                                quantityInStock: 10,
                            },
                        },
                    ],
                },
            ]);

            const result = await service.calculateProductionSuggestions();

            expect(result.suggestions[0].unitValue).toBe(99.99);
            expect(result.suggestions[0].totalValue).toBeCloseTo(999.9, 1);
        });
    });
});

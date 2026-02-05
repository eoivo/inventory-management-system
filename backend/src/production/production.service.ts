import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
    ProductionResponseDto,
    MaterialUsageDto,
} from './dto';

interface ProductWithMaterials {
    id: string;
    code: string;
    name: string;
    value: number | { toNumber(): number };
    materials: {
        quantityNeeded: number;
        rawMaterialId: string;
        rawMaterial: {
            id: string;
            code: string;
            name: string;
            quantityInStock: number;
        };
    }[];
}

interface AllocatedProduction {
    product: ProductWithMaterials;
    quantityAllocated: number;
    unitValue: number;
    totalValue: number;
    materialsUsed: MaterialUsageDto[];
}

@Injectable()
export class ProductionService {
    constructor(private readonly prisma: PrismaService) { }

    async calculateProductionSuggestions(): Promise<ProductionResponseDto> {
        // Step 1: Fetch all products with their material requirements
        const products = await this.prisma.product.findMany({
            include: {
                materials: {
                    include: {
                        rawMaterial: true,
                    },
                },
            },
        });

        // Step 2: Calculate how many of each product can be produced
        const productionCapacity = products.map((product) => {
            // Products without materials cannot be produced
            if (product.materials.length === 0) {
                return {
                    product,
                    maxQuantity: 0,
                    unitValue: Number(product.value),
                    totalValue: 0,
                };
            }

            const materialConstraints = product.materials.map((pm) => {
                const available = pm.rawMaterial.quantityInStock;
                const needed = pm.quantityNeeded;
                return Math.floor(available / needed);
            });

            const maxProducible = Math.min(...materialConstraints);

            return {
                product,
                maxQuantity: maxProducible,
                unitValue: Number(product.value),
                totalValue: maxProducible * Number(product.value),
            };
        });

        // Step 3: Filter producible products and sort by unit value (descending)
        const producibleProducts = productionCapacity
            .filter((p) => p.maxQuantity > 0)
            .sort((a, b) => {
                // Primary sort: by unit value (descending)
                if (b.unitValue !== a.unitValue) {
                    return b.unitValue - a.unitValue;
                }
                // Secondary sort: by code (alphabetical)
                return a.product.code.localeCompare(b.product.code);
            });

        // Step 4: Apply greedy algorithm to optimize production
        const suggestions = this.optimizeProduction(producibleProducts);

        // Step 5: Calculate total value
        const totalValue = suggestions.reduce((sum, s) => sum + s.totalValue, 0);

        return {
            suggestions: suggestions.map((s) => ({
                productId: s.product.id,
                productCode: s.product.code,
                productName: s.product.name,
                unitValue: s.unitValue,
                quantityToProduce: s.quantityAllocated,
                totalValue: s.totalValue,
                materialsUsed: s.materialsUsed,
            })),
            totalProductionValue: totalValue,
            timestamp: new Date(),
        };
    }

    private optimizeProduction(
        producibleProducts: {
            product: ProductWithMaterials;
            maxQuantity: number;
            unitValue: number;
            totalValue: number;
        }[],
    ): AllocatedProduction[] {
        const allocated: AllocatedProduction[] = [];
        const stockTracker = new Map<string, number>();

        // Initialize stock tracker with current quantities
        for (const prod of producibleProducts) {
            for (const material of prod.product.materials) {
                if (!stockTracker.has(material.rawMaterialId)) {
                    stockTracker.set(
                        material.rawMaterialId,
                        material.rawMaterial.quantityInStock,
                    );
                }
            }
        }

        // Greedy allocation: prioritize by highest unit value
        for (const productCapacity of producibleProducts) {
            const { product } = productCapacity;

            // Calculate how much can actually be produced with current tracked stock
            let actualProducible = Infinity;

            for (const material of product.materials) {
                const currentStock = stockTracker.get(material.rawMaterialId) || 0;
                const possibleWithThisMaterial = Math.floor(
                    currentStock / material.quantityNeeded,
                );
                actualProducible = Math.min(actualProducible, possibleWithThisMaterial);
            }

            if (actualProducible > 0 && actualProducible !== Infinity) {
                // Allocate production and deduct materials
                const materialsUsed: MaterialUsageDto[] = [];

                for (const material of product.materials) {
                    const quantityUsed = material.quantityNeeded * actualProducible;
                    const currentStock = stockTracker.get(material.rawMaterialId) || 0;
                    stockTracker.set(material.rawMaterialId, currentStock - quantityUsed);

                    materialsUsed.push({
                        rawMaterialId: material.rawMaterialId,
                        rawMaterialCode: material.rawMaterial.code,
                        rawMaterialName: material.rawMaterial.name,
                        quantityNeeded: material.quantityNeeded,
                        totalQuantityUsed: quantityUsed,
                    });
                }

                allocated.push({
                    product,
                    quantityAllocated: actualProducible,
                    unitValue: Number(product.value),
                    totalValue: actualProducible * Number(product.value),
                    materialsUsed,
                });
            }
        }

        return allocated;
    }
}

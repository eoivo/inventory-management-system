import { ApiProperty } from '@nestjs/swagger';

export class MaterialUsageDto {
    @ApiProperty({ description: 'Raw material ID' })
    rawMaterialId: string;

    @ApiProperty({ description: 'Raw material code' })
    rawMaterialCode: string;

    @ApiProperty({ description: 'Raw material name' })
    rawMaterialName: string;

    @ApiProperty({ description: 'Quantity needed per product unit' })
    quantityNeeded: number;

    @ApiProperty({ description: 'Total quantity that will be consumed' })
    totalQuantityUsed: number;
}

export class ProductionSuggestionDto {
    @ApiProperty({ description: 'Product ID' })
    productId: string;

    @ApiProperty({ description: 'Product code' })
    productCode: string;

    @ApiProperty({ description: 'Product name' })
    productName: string;

    @ApiProperty({ description: 'Unit value of the product' })
    unitValue: number;

    @ApiProperty({ description: 'Suggested quantity to produce' })
    quantityToProduce: number;

    @ApiProperty({ description: 'Total value if produced' })
    totalValue: number;

    @ApiProperty({ description: 'Materials that will be used', type: [MaterialUsageDto] })
    materialsUsed: MaterialUsageDto[];
}

export class ProductionResponseDto {
    @ApiProperty({ description: 'List of production suggestions', type: [ProductionSuggestionDto] })
    suggestions: ProductionSuggestionDto[];

    @ApiProperty({ description: 'Total production value' })
    totalProductionValue: number;

    @ApiProperty({ description: 'Calculation timestamp' })
    timestamp: Date;
}

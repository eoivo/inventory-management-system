import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductMaterialDto {
    @ApiProperty({
        description: 'ID of the raw material to associate',
        example: 'uuid-of-raw-material',
    })
    @IsString()
    @IsNotEmpty()
    rawMaterialId: string;

    @ApiProperty({
        description: 'Quantity of material needed per product unit',
        example: 2,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    quantityNeeded: number;
}

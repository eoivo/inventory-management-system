import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductMaterialDto {
    @ApiProperty({
        description: 'New quantity of material needed per product unit',
        example: 1.5,
        minimum: 0.01,
    })
    @IsNumber()
    @Min(0.01)
    @Type(() => Number)
    quantityNeeded: number;
}

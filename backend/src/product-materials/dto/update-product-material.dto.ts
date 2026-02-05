import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductMaterialDto {
    @ApiProperty({
        description: 'New quantity of material needed per product unit',
        example: 3,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    quantityNeeded: number;
}

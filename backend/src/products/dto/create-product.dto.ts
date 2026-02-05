import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsNumber,
    IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Unique product code',
        example: 'PROD001',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Plastic Bag',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Unit value/price of the product',
        example: 10.5,
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    value: number;
}

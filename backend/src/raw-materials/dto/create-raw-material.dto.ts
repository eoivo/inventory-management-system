import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsNumber,
    Min,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRawMaterialDto {
    @ApiProperty({
        description: 'Unique material code',
        example: 'RM001',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @ApiProperty({
        description: 'Material name',
        example: 'Plastic Resin',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Current stock quantity',
        example: 100,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    quantityInStock?: number = 0;

    @ApiProperty({
        description: 'Unit of measurement',
        example: 'kg',
        default: 'un',
        maxLength: 10,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    unit?: string = 'un';
}

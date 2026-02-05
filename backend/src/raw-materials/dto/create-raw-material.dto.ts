import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsInt,
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
    @IsInt()
    @Min(0)
    @Type(() => Number)
    quantityInStock?: number = 0;
}

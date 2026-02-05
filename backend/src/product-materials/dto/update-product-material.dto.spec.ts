import { validate } from 'class-validator';
import { UpdateProductMaterialDto } from './update-product-material.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateProductMaterialDto', () => {
    it('should validate a correct update product material DTO', async () => {
        const payload = {
            quantityNeeded: 10,
        };
        const dto = plainToInstance(UpdateProductMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
        expect(typeof dto.quantityNeeded).toBe('number');
    });

    it('should fail if quantityNeeded is less than 1', async () => {
        const payload = {
            quantityNeeded: 0,
        };
        const dto = plainToInstance(UpdateProductMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should convert string quantity to number', async () => {
        const payload = {
            quantityNeeded: '15',
        };
        const dto = plainToInstance(UpdateProductMaterialDto, payload);
        expect(typeof dto.quantityNeeded).toBe('number');
        expect(dto.quantityNeeded).toBe(15);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });
});

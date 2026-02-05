import { validate } from 'class-validator';
import { CreateProductMaterialDto } from './create-product-material.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateProductMaterialDto', () => {
    it('should validate a correct product material DTO', async () => {
        const payload = {
            rawMaterialId: 'uuid-1',
            quantityNeeded: 5,
        };
        const dto = plainToInstance(CreateProductMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail if quantityNeeded is 0', async () => {
        const payload = {
            rawMaterialId: 'uuid-1',
            quantityNeeded: 0,
        };
        const dto = plainToInstance(CreateProductMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});

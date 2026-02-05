import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateProductDto', () => {
    it('should validate a correct product DTO', async () => {
        const payload = {
            code: 'PROD001',
            name: 'Test Product',
            value: 100,
        };
        const dto = plainToInstance(CreateProductDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail if code is empty', async () => {
        const payload = {
            code: '',
            name: 'Test Product',
            value: 100,
        };
        const dto = plainToInstance(CreateProductDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if value is negative', async () => {
        const payload = {
            code: 'PROD001',
            name: 'Test Product',
            value: -1,
        };
        const dto = plainToInstance(CreateProductDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});

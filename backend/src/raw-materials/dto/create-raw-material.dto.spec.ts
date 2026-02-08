import { validate } from 'class-validator';
import { CreateRawMaterialDto } from './create-raw-material.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateRawMaterialDto', () => {
    it('should validate a correct raw material DTO', async () => {
        const payload = {
            code: 'RM001',
            name: 'Test Material',
            quantityInStock: 100,
        };
        const dto = plainToInstance(CreateRawMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should validate if quantityInStock is missing (optional with default)', async () => {
        const payload = {
            code: 'RM001',
            name: 'Test Material',
        };
        const dto = plainToInstance(CreateRawMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail if code is longer than 50 chars', async () => {
        const payload = {
            code: 'A'.repeat(51),
            name: 'Test Material',
        };
        const dto = plainToInstance(CreateRawMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate if quantityInStock is a decimal', async () => {
        const payload = {
            code: 'RM001',
            name: 'Test Material',
            quantityInStock: 10.5,
        };
        const dto = plainToInstance(CreateRawMaterialDto, payload);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });
});

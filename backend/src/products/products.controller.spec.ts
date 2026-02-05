import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

describe('ProductsController', () => {
    let controller: ProductsController;
    let service: {
        create: jest.Mock;
        findAll: jest.Mock;
        findOne: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    const mockProduct = {
        id: '1',
        code: 'PROD001',
        name: 'Test Product',
        value: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [{ provide: ProductsService, useValue: service }],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create and return product', async () => {
            const dto: CreateProductDto = { code: 'PROD001', name: 'New Product', value: 150 };
            service.create.mockResolvedValue(mockProduct);

            const result = await controller.create(dto);

            expect(result).toEqual(mockProduct);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll and return array', async () => {
            service.findAll.mockResolvedValue([mockProduct]);

            const result = await controller.findAll();

            expect(result).toEqual([mockProduct]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should call service.findOne and return product', async () => {
            service.findOne.mockResolvedValue(mockProduct);

            const result = await controller.findOne('1');

            expect(result).toEqual(mockProduct);
            expect(service.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should call service.update and return updated product', async () => {
            const dto: UpdateProductDto = { name: 'Updated Name' };
            service.update.mockResolvedValue({ ...mockProduct, name: 'Updated Name' });

            const result = await controller.update('1', dto);

            expect(result.name).toBe('Updated Name');
            expect(service.update).toHaveBeenCalledWith('1', dto);
        });
    });

    describe('remove', () => {
        it('should call service.remove', async () => {
            service.remove.mockResolvedValue(undefined);

            await controller.remove('1');

            expect(service.remove).toHaveBeenCalledWith('1');
        });
    });
});

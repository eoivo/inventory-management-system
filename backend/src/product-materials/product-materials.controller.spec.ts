import { Test, TestingModule } from '@nestjs/testing';
import { ProductMaterialsController } from './product-materials.controller';
import { ProductMaterialsService } from './product-materials.service';
import { CreateProductMaterialDto, UpdateProductMaterialDto } from './dto';

describe('ProductMaterialsController', () => {
    let controller: ProductMaterialsController;
    let service: {
        create: jest.Mock;
        findAllByProduct: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    const mockAssociation = {
        id: '1',
        productId: 'prod-1',
        rawMaterialId: 'mat-1',
        quantityNeeded: 5,
    };

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAllByProduct: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductMaterialsController],
            providers: [{ provide: ProductMaterialsService, useValue: service }],
        }).compile();

        controller = module.get<ProductMaterialsController>(ProductMaterialsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto: CreateProductMaterialDto = { rawMaterialId: 'mat-1', quantityNeeded: 5 };
            service.create.mockResolvedValue(mockAssociation);

            const result = await controller.create('prod-1', dto);

            expect(result).toEqual(mockAssociation);
            expect(service.create).toHaveBeenCalledWith('prod-1', dto);
        });
    });

    describe('findAll', () => {
        it('should call service.findAllByProduct', async () => {
            service.findAllByProduct.mockResolvedValue([mockAssociation]);

            const result = await controller.findAll('prod-1');

            expect(result).toEqual([mockAssociation]);
            expect(service.findAllByProduct).toHaveBeenCalledWith('prod-1');
        });
    });

    describe('update', () => {
        it('should call service.update', async () => {
            const dto: UpdateProductMaterialDto = { quantityNeeded: 10 };
            service.update.mockResolvedValue({ ...mockAssociation, quantityNeeded: 10 });

            const result = await controller.update('prod-1', 'mat-1', dto);

            expect(result.quantityNeeded).toBe(10);
            expect(service.update).toHaveBeenCalledWith('prod-1', 'mat-1', dto);
        });
    });

    describe('remove', () => {
        it('should call service.remove', async () => {
            service.remove.mockResolvedValue(undefined);

            await controller.remove('prod-1', 'mat-1');

            expect(service.remove).toHaveBeenCalledWith('prod-1', 'mat-1');
        });
    });
});

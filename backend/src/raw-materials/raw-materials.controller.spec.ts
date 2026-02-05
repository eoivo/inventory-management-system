import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialsController } from './raw-materials.controller';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto, UpdateRawMaterialDto } from './dto';

describe('RawMaterialsController', () => {
    let controller: RawMaterialsController;
    let service: {
        create: jest.Mock;
        findAll: jest.Mock;
        findOne: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    const mockMaterial = {
        id: '1',
        code: 'RM001',
        name: 'Test Material',
        quantityInStock: 100,
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
            controllers: [RawMaterialsController],
            providers: [{ provide: RawMaterialsService, useValue: service }],
        }).compile();

        controller = module.get<RawMaterialsController>(RawMaterialsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create and return material', async () => {
            const dto: CreateRawMaterialDto = { code: 'RM001', name: 'New Material', quantityInStock: 150 };
            service.create.mockResolvedValue(mockMaterial);

            const result = await controller.create(dto);

            expect(result).toEqual(mockMaterial);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll and return array', async () => {
            service.findAll.mockResolvedValue([mockMaterial]);

            const result = await controller.findAll();

            expect(result).toEqual([mockMaterial]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should call service.findOne and return material', async () => {
            service.findOne.mockResolvedValue(mockMaterial);

            const result = await controller.findOne('1');

            expect(result).toEqual(mockMaterial);
            expect(service.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should call service.update and return updated material', async () => {
            const dto: UpdateRawMaterialDto = { name: 'Updated Name' };
            service.update.mockResolvedValue({ ...mockMaterial, name: 'Updated Name' });

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

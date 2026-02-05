import { Test, TestingModule } from '@nestjs/testing';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';

describe('ProductionController', () => {
    let controller: ProductionController;
    let service: {
        calculateProductionSuggestions: jest.Mock;
    };

    const mockResponse = {
        suggestions: [],
        totalProductionValue: 0,
        timestamp: new Date(),
    };

    beforeEach(async () => {
        service = {
            calculateProductionSuggestions: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductionController],
            providers: [{ provide: ProductionService, useValue: service }],
        }).compile();

        controller = module.get<ProductionController>(ProductionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getSuggestions', () => {
        it('should call service.calculateProductionSuggestions', async () => {
            service.calculateProductionSuggestions.mockResolvedValue(mockResponse);

            const result = await controller.getSuggestions();

            expect(result).toEqual(mockResponse);
            expect(service.calculateProductionSuggestions).toHaveBeenCalled();
        });
    });
});

import { describe, it, expect, vi } from 'vitest';
import api from '../api';
import {
    productsService,
    rawMaterialsService,
    productMaterialsService,
    productionService
} from '../index';

vi.mock('../api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));

describe('services', () => {
    describe('productsService', () => {
        it('getAll should call api.get', () => {
            productsService.getAll();
            expect(api.get).toHaveBeenCalledWith('/products');
        });

        it('getById should call api.get with id', () => {
            productsService.getById('123');
            expect(api.get).toHaveBeenCalledWith('/products/123');
        });

        it('create should call api.post with data', () => {
            const data = { code: 'P1', name: 'Prod 1', value: 10 };
            productsService.create(data);
            expect(api.post).toHaveBeenCalledWith('/products', data);
        });

        it('update should call api.put with id and data', () => {
            const data = { name: 'New Name' };
            productsService.update('123', data);
            expect(api.put).toHaveBeenCalledWith('/products/123', data);
        });

        it('delete should call api.delete with id', () => {
            productsService.delete('123');
            expect(api.delete).toHaveBeenCalledWith('/products/123');
        });
    });

    describe('rawMaterialsService', () => {
        it('getAll should call api.get', () => {
            rawMaterialsService.getAll();
            expect(api.get).toHaveBeenCalledWith('/raw-materials');
        });

        it('getById should call api.get with id', () => {
            rawMaterialsService.getById('123');
            expect(api.get).toHaveBeenCalledWith('/raw-materials/123');
        });

        it('create should call api.post with data', () => {
            const data = { code: 'RM1', name: 'Mat 1' };
            rawMaterialsService.create(data);
            expect(api.post).toHaveBeenCalledWith('/raw-materials', data);
        });

        it('update should call api.put with id and data', () => {
            const data = { quantityInStock: 100 };
            rawMaterialsService.update('123', data);
            expect(api.put).toHaveBeenCalledWith('/raw-materials/123', data);
        });

        it('delete should call api.delete with id', () => {
            rawMaterialsService.delete('123');
            expect(api.delete).toHaveBeenCalledWith('/raw-materials/123');
        });
    });

    describe('productMaterialsService', () => {
        it('getByProduct should call api.get with productId', () => {
            productMaterialsService.getByProduct('p1');
            expect(api.get).toHaveBeenCalledWith('/products/p1/materials');
        });

        it('add should call api.post with data', () => {
            const data = { rawMaterialId: 'm1', quantityNeeded: 2 };
            productMaterialsService.add('p1', data);
            expect(api.post).toHaveBeenCalledWith('/products/p1/materials', data);
        });

        it('update should call api.put with id and data', () => {
            const data = { quantityNeeded: 5 };
            productMaterialsService.update('p1', 'm1', data);
            expect(api.put).toHaveBeenCalledWith('/products/p1/materials/m1', data);
        });

        it('remove should call api.delete with ids', () => {
            productMaterialsService.remove('p1', 'm1');
            expect(api.delete).toHaveBeenCalledWith('/products/p1/materials/m1');
        });
    });

    describe('productionService', () => {
        it('getSuggestions should call api.get', () => {
            productionService.getSuggestions();
            expect(api.get).toHaveBeenCalledWith('/production/suggestions');
        });
    });
});

import { describe, it, expect, vi } from 'vitest';
import productMaterialsReducer, {
    clearProductMaterials,
    fetchProductMaterials,
} from '../productMaterialsSlice';
import { productMaterialsService } from '../../services';

vi.mock('../../services', () => ({
    productMaterialsService: {
        getByProduct: vi.fn(),
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn()
    },
    rawMaterialsService: {
        getAll: vi.fn()
    }
}));

describe('productMaterialsSlice', () => {
    const initialState = {
        items: [],
        availableMaterials: [],
        loading: false,
        error: null,
        currentProductId: null,
    };

    it('should return initial state', () => {
        expect(productMaterialsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearProductMaterials', () => {
        const state = {
            ...initialState,
            items: [{
                id: 'pm1',
                productId: '1',
                rawMaterialId: '1',
                quantityNeeded: 1,
                createdAt: '',
                updatedAt: '',
                rawMaterial: { id: '1', code: 'RM1', name: 'Material 1', quantityInStock: 100, createdAt: '', updatedAt: '' }
            }] as any,
            currentProductId: '1'
        };
        expect(productMaterialsReducer(state as any, clearProductMaterials())).toEqual(initialState);
    });

    describe('async thunks', () => {
        it('fetchProductMaterials.fulfilled should update items and currentProductId', async () => {
            const productId = 'prod123';
            const mockMaterials = [
                { productId, rawMaterialId: 'rm1', quantityNeeded: 5, createdAt: '', updatedAt: '' }
            ];
            (productMaterialsService.getByProduct as any).mockResolvedValueOnce({ data: mockMaterials });

            const dispatch = vi.fn();
            const thunk = fetchProductMaterials(productId);
            await thunk(dispatch, () => ({}), {});

            const { calls } = dispatch.mock;
            expect(calls[1][0].type).toBe(fetchProductMaterials.fulfilled.type);
            expect(calls[1][0].payload).toEqual({ productId, materials: mockMaterials });
        });
    });
});

import { describe, it, expect, vi } from 'vitest';
import productsReducer, {
    clearError,
    clearSelectedProduct,
    fetchProducts,
    createProduct
} from '../productsSlice';
import { productsService } from '../../services';

// Mock the productsService
vi.mock('../../services', () => ({
    productsService: {
        getAll: vi.fn(),
        create: vi.fn(),
        getById: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('productsSlice', () => {
    const initialState = {
        items: [],
        selectedProduct: null,
        loading: false,
        error: null,
    };

    it('should return initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        expect(productsReducer(state, clearError())).toEqual(initialState);
    });

    it('should handle clearSelectedProduct', () => {
        const product = { id: '1', code: 'P1', name: 'Prod 1', value: 10, createdAt: '', updatedAt: '' };
        const state = { ...initialState, selectedProduct: product };
        expect(productsReducer(state, clearSelectedProduct())).toEqual(initialState);
    });

    describe('async thunks', () => {
        it('fetchProducts.fulfilled should update items', async () => {
            const mockProducts = [
                { id: '1', code: 'P1', name: 'Prod 1', value: 10, createdAt: '', updatedAt: '' }
            ];

            // Setup the mock response
            (productsService.getAll as any).mockResolvedValueOnce({ data: mockProducts });

            const dispatch = vi.fn();
            const thunk = fetchProducts();
            await thunk(dispatch, () => ({}), {});

            const { calls } = dispatch.mock;
            expect(calls[0][0].type).toBe(fetchProducts.pending.type);
            expect(calls[1][0].type).toBe(fetchProducts.fulfilled.type);
            expect(calls[1][0].payload).toEqual(mockProducts);
        });

        it('createProduct.fulfilled should add item to list', async () => {
            const newProduct = { id: '2', code: 'P2', name: 'Prod 2', value: 20, createdAt: '', updatedAt: '' };
            (productsService.create as any).mockResolvedValueOnce({ data: newProduct });

            const dispatch = vi.fn();
            const thunk = createProduct({ code: 'P2', name: 'Prod 2', value: 20 });
            await thunk(dispatch, () => ({}), {});

            const { calls } = dispatch.mock;
            expect(calls[1][0].type).toBe(createProduct.fulfilled.type);
            expect(calls[1][0].payload).toEqual(newProduct);
        });
    });
});

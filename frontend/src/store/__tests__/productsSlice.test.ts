import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsReducer, {
    clearError,
    clearSelectedProduct,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../productsSlice';
import { productsService } from '../../services';

vi.mock('../../services', () => ({
    productsService: {
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
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

    const mockProduct = { id: '1', code: 'P1', name: 'Prod 1', value: 10, createdAt: '', updatedAt: '' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        expect(productsReducer(state, clearError())).toEqual(initialState);
    });

    it('should handle clearSelectedProduct', () => {
        const state = { ...initialState, selectedProduct: mockProduct };
        expect(productsReducer(state, clearSelectedProduct())).toEqual(initialState);
    });

    describe('extraReducers', () => {
        it('fetchProducts.pending should set loading', () => {
            const state = productsReducer(initialState, fetchProducts.pending(''));
            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });

        it('fetchProducts.fulfilled should update items', () => {
            const mockProducts = [mockProduct];
            const state = productsReducer(
                { ...initialState, loading: true },
                fetchProducts.fulfilled(mockProducts, '')
            );
            expect(state.loading).toBe(false);
            expect(state.items).toEqual(mockProducts);
        });

        it('fetchProducts.rejected should set error', () => {
            const error = 'Failed to fetch';
            const state = productsReducer(
                { ...initialState, loading: true },
                fetchProducts.rejected(null, '', undefined, error)
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe(error);
        });

        it('fetchProductById.fulfilled should set selectedProduct', () => {
            const state = productsReducer(
                { ...initialState, loading: true },
                fetchProductById.fulfilled(mockProduct, '', '1')
            );
            expect(state.loading).toBe(false);
            expect(state.selectedProduct).toEqual(mockProduct);
        });

        it('fetchProductById.rejected should set error', () => {
            const state = productsReducer(
                { ...initialState, loading: true },
                fetchProductById.rejected(null, '', '1', 'Error')
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Error');
        });

        it('createProduct.fulfilled should add item to list', () => {
            const state = productsReducer(
                { ...initialState, items: [mockProduct] },
                createProduct.fulfilled({ ...mockProduct, id: '2' }, '', { code: 'P2', name: 'P2', value: 20 })
            );
            expect(state.items).toHaveLength(2);
            expect(state.items[0].id).toBe('2');
        });

        it('updateProduct.fulfilled should update item in list and selectedProduct', () => {
            const updated = { ...mockProduct, name: 'Updated' };
            const state = productsReducer(
                { ...initialState, items: [mockProduct], selectedProduct: mockProduct },
                updateProduct.fulfilled(updated, '', { id: '1', data: {} })
            );
            expect(state.items[0].name).toBe('Updated');
            expect(state.selectedProduct?.name).toBe('Updated');
        });

        it('updateProduct.rejected should set error', () => {
            const state = productsReducer(
                { ...initialState, loading: true },
                updateProduct.rejected(null, '', { id: '1', data: {} }, 'Error')
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Error');
        });

        it('deleteProduct.fulfilled should remove item from list and clear selectedProduct', () => {
            const state = productsReducer(
                { ...initialState, items: [mockProduct], selectedProduct: mockProduct },
                deleteProduct.fulfilled('1', '', '1')
            );
            expect(state.items).toHaveLength(0);
            expect(state.selectedProduct).toBeNull();
        });

        it('deleteProduct.rejected should set error', () => {
            const state = productsReducer(
                { ...initialState, loading: true },
                deleteProduct.rejected(null, '', '1', 'Error')
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe('Error');
        });
    });

    describe('thunk actions', () => {
        it('fetchProducts success', async () => {
            (productsService.getAll as any).mockResolvedValueOnce({ data: [mockProduct] });
            const dispatch = vi.fn();
            await fetchProducts()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProducts.fulfilled.type }));
        });

        it('fetchProductById success', async () => {
            (productsService.getById as any).mockResolvedValueOnce({ data: mockProduct });
            const dispatch = vi.fn();
            await fetchProductById('1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProductById.fulfilled.type }));
        });

        it('createProduct success', async () => {
            (productsService.create as any).mockResolvedValueOnce({ data: mockProduct });
            const dispatch = vi.fn();
            await createProduct({ code: 'P', name: 'N', value: 1 })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createProduct.fulfilled.type }));
        });

        it('updateProduct success', async () => {
            (productsService.update as any).mockResolvedValueOnce({ data: mockProduct });
            const dispatch = vi.fn();
            await updateProduct({ id: '1', data: {} })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: updateProduct.fulfilled.type }));
        });

        it('deleteProduct success', async () => {
            (productsService.delete as any).mockResolvedValueOnce({ data: {} });
            const dispatch = vi.fn();
            await deleteProduct('1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteProduct.fulfilled.type }));
        });

        it('should handle failure with custom message', async () => {
            (productsService.getAll as any).mockRejectedValueOnce({
                response: { data: { message: 'Custom Error' } }
            });
            const dispatch = vi.fn();
            await fetchProducts()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: fetchProducts.rejected.type,
                payload: 'Custom Error'
            }));
        });
    });
});

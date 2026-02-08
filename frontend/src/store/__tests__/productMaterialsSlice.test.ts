import { describe, it, expect, vi, beforeEach } from 'vitest';
import productMaterialsReducer, {
    clearProductMaterials,
    clearError,
    fetchProductMaterials,
    fetchAvailableMaterials,
    addProductMaterial,
    updateProductMaterial,
    removeProductMaterial
} from '../productMaterialsSlice';
import { productMaterialsService, rawMaterialsService } from '../../services';

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

    const mockMaterial = {
        id: 'pm1',
        productId: 'p1',
        rawMaterialId: 'm1',
        quantityNeeded: 2,
        rawMaterial: { id: 'm1', code: 'RM1', name: 'Mat 1', quantityInStock: 20, unit: 'un', createdAt: '', updatedAt: '' }
    };

    const mockRawMaterial = { id: 'm1', code: 'RM1', name: 'Mat 1', quantityInStock: 20, unit: 'un', createdAt: '', updatedAt: '' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        expect(productMaterialsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearProductMaterials', () => {
        const state = { ...initialState, items: [mockMaterial], currentProductId: 'p1' };
        expect(productMaterialsReducer(state, clearProductMaterials())).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        expect(productMaterialsReducer(state, clearError())).toEqual(initialState);
    });

    describe('extraReducers', () => {
        it('fetchProductMaterials.pending should set loading', () => {
            const state = productMaterialsReducer(initialState, fetchProductMaterials.pending('', 'p1'));
            expect(state.loading).toBe(true);
        });

        it('fetchProductMaterials.fulfilled should update items and currentProductId', () => {
            const state = productMaterialsReducer(
                { ...initialState, loading: true },
                fetchProductMaterials.fulfilled({ productId: 'p1', materials: [mockMaterial] }, '', 'p1')
            );
            expect(state.loading).toBe(false);
            expect(state.items).toEqual([mockMaterial]);
            expect(state.currentProductId).toBe('p1');
        });

        it('fetchProductMaterials.rejected should set error', () => {
            const state = productMaterialsReducer(
                { ...initialState, loading: true },
                fetchProductMaterials.rejected(null, '', 'p1', 'Error')
            );
            expect(state.error).toBe('Error');
            expect(state.loading).toBe(false);
        });

        it('fetchAvailableMaterials.pending should set loading', () => {
            const state = productMaterialsReducer(initialState, fetchAvailableMaterials.pending(''));
            expect(state.loading).toBe(true);
        });

        it('fetchAvailableMaterials.fulfilled should update availableMaterials', () => {
            const state = productMaterialsReducer(
                { ...initialState, loading: true },
                fetchAvailableMaterials.fulfilled([mockRawMaterial], '', undefined)
            );
            expect(state.availableMaterials).toEqual([mockRawMaterial]);
        });

        it('fetchAvailableMaterials.rejected should set error', () => {
            const state = productMaterialsReducer(
                initialState,
                fetchAvailableMaterials.rejected(null, '', undefined, 'Error')
            );
            expect(state.error).toBe('Error');
        });

        it('addProductMaterial.pending should set loading', () => {
            const state = productMaterialsReducer(initialState, addProductMaterial.pending('', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 }));
            expect(state.loading).toBe(true);
        });

        it('addProductMaterial.fulfilled should add item to list', () => {
            const state = productMaterialsReducer(
                { ...initialState, loading: true },
                addProductMaterial.fulfilled(mockMaterial, '', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 })
            );
            expect(state.items).toEqual([mockMaterial]);
        });

        it('addProductMaterial.rejected should set error', () => {
            const state = productMaterialsReducer(initialState, addProductMaterial.rejected(null, '', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 }, 'Error'));
            expect(state.error).toBe('Error');
        });

        it('updateProductMaterial.pending should set loading', () => {
            const state = productMaterialsReducer(initialState, updateProductMaterial.pending('', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 5 }));
            expect(state.loading).toBe(true);
        });

        it('updateProductMaterial.fulfilled should update item in list', () => {
            const updated = { ...mockMaterial, quantityNeeded: 5 };
            const state = productMaterialsReducer(
                { ...initialState, items: [mockMaterial], loading: true },
                updateProductMaterial.fulfilled(updated, '', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 5 })
            );
            expect(state.items[0].quantityNeeded).toBe(5);
        });

        it('updateProductMaterial.fulfilled should do nothing if item not found', () => {
            const updated = { ...mockMaterial, rawMaterialId: 'other' };
            const state = productMaterialsReducer(
                { ...initialState, items: [mockMaterial] },
                updateProductMaterial.fulfilled(updated, '', { productId: 'p1', rawMaterialId: 'other', quantityNeeded: 5 })
            );
            expect(state.items[0].rawMaterialId).toBe('m1');
        });

        it('updateProductMaterial.rejected should set error', () => {
            const state = productMaterialsReducer(
                initialState,
                updateProductMaterial.rejected(null, '', { productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 5 }, 'Error')
            );
            expect(state.error).toBe('Error');
        });

        it('removeProductMaterial.pending should set loading', () => {
            const state = productMaterialsReducer(initialState, removeProductMaterial.pending('', { productId: 'p1', rawMaterialId: 'm1' }));
            expect(state.loading).toBe(true);
        });

        it('removeProductMaterial.fulfilled should remove item from list', () => {
            const state = productMaterialsReducer(
                { ...initialState, items: [mockMaterial], loading: true },
                removeProductMaterial.fulfilled('m1', '', { productId: 'p1', rawMaterialId: 'm1' })
            );
            expect(state.items).toHaveLength(0);
        });

        it('removeProductMaterial.rejected should set error', () => {
            const state = productMaterialsReducer(
                initialState,
                removeProductMaterial.rejected(null, '', { productId: 'p1', rawMaterialId: 'm1' }, 'Error')
            );
            expect(state.error).toBe('Error');
        });
    });

    describe('thunk actions', () => {
        it('fetchProductMaterials success', async () => {
            (productMaterialsService.getByProduct as any).mockResolvedValueOnce({ data: [mockMaterial] });
            const dispatch = vi.fn();
            await fetchProductMaterials('p1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProductMaterials.fulfilled.type }));
        });

        it('fetchAvailableMaterials success', async () => {
            (rawMaterialsService.getAll as any).mockResolvedValueOnce({ data: [mockRawMaterial] });
            const dispatch = vi.fn();
            await fetchAvailableMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchAvailableMaterials.fulfilled.type }));
        });

        it('addProductMaterial success', async () => {
            (productMaterialsService.add as any).mockResolvedValueOnce({ data: mockMaterial });
            const dispatch = vi.fn();
            await addProductMaterial({ productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: addProductMaterial.fulfilled.type }));
        });

        it('updateProductMaterial success', async () => {
            (productMaterialsService.update as any).mockResolvedValueOnce({ data: mockMaterial });
            const dispatch = vi.fn();
            await updateProductMaterial({ productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: updateProductMaterial.fulfilled.type }));
        });

        it('removeProductMaterial success', async () => {
            (productMaterialsService.remove as any).mockResolvedValueOnce({ data: {} });
            const dispatch = vi.fn();
            await removeProductMaterial({ productId: 'p1', rawMaterialId: 'm1' })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: removeProductMaterial.fulfilled.type }));
        });

        it('thunks should handle errors for all actions', async () => {
            const errorMessage = 'Custom Error';
            const errorResponse = { response: { data: { message: errorMessage } } };

            // fetchProductMaterials
            (productMaterialsService.getByProduct as any).mockRejectedValueOnce(errorResponse);
            let dispatch = vi.fn();
            await fetchProductMaterials('p1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProductMaterials.rejected.type, payload: errorMessage }));

            // fetchAvailableMaterials
            (rawMaterialsService.getAll as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await fetchAvailableMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchAvailableMaterials.rejected.type, payload: errorMessage }));

            // addProductMaterial
            (productMaterialsService.add as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await addProductMaterial({ productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: addProductMaterial.rejected.type, payload: errorMessage }));

            // updateProductMaterial
            (productMaterialsService.update as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await updateProductMaterial({ productId: 'p1', rawMaterialId: 'm1', quantityNeeded: 2 })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: updateProductMaterial.rejected.type, payload: errorMessage }));

            // removeProductMaterial
            (productMaterialsService.remove as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await removeProductMaterial({ productId: 'p1', rawMaterialId: 'm1' })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: removeProductMaterial.rejected.type, payload: errorMessage }));
        });

        it('thunks should handle different error response structures for branch coverage', async () => {
            // Case 1: err.response is undefined
            (productMaterialsService.getByProduct as any).mockRejectedValueOnce({});
            let dispatch = vi.fn();
            await fetchProductMaterials('p1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: fetchProductMaterials.rejected.type,
                payload: 'Failed to fetch product materials'
            }));

            // Case 2: err.response.data is undefined
            (productMaterialsService.getByProduct as any).mockRejectedValueOnce({ response: {} });
            dispatch = vi.fn();
            await fetchProductMaterials('p1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                payload: 'Failed to fetch product materials'
            }));

            // Case 3: err.response.data.message is undefined
            (productMaterialsService.getByProduct as any).mockRejectedValueOnce({ response: { data: {} } });
            dispatch = vi.fn();
            await fetchProductMaterials('p1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                payload: 'Failed to fetch product materials'
            }));
        });
    });
});

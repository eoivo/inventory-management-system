import { describe, it, expect, vi, beforeEach } from 'vitest';
import rawMaterialsReducer, {
    clearError,
    setSelectedMaterial,
    fetchRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial
} from '../rawMaterialsSlice';
import { rawMaterialsService } from '../../services';

vi.mock('../../services', () => ({
    rawMaterialsService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('rawMaterialsSlice', () => {
    const initialState = {
        items: [],
        selectedMaterial: null,
        loading: false,
        error: null,
    };

    const mockMaterial = { id: '1', code: 'RM1', name: 'Mat 1', quantityInStock: 10, unit: 'un', createdAt: '', updatedAt: '' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        expect(rawMaterialsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        expect(rawMaterialsReducer(state, clearError())).toEqual(initialState);
    });

    it('should handle setSelectedMaterial', () => {
        const state = rawMaterialsReducer(initialState, setSelectedMaterial(mockMaterial));
        expect(state.selectedMaterial).toEqual(mockMaterial);
    });

    describe('extraReducers', () => {
        it('fetchRawMaterials.pending should set loading', () => {
            const state = rawMaterialsReducer(initialState, fetchRawMaterials.pending(''));
            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });

        it('fetchRawMaterials.fulfilled should update items', () => {
            const mockItems = [mockMaterial];
            const state = rawMaterialsReducer(
                { ...initialState, loading: true },
                fetchRawMaterials.fulfilled(mockItems, '')
            );
            expect(state.loading).toBe(false);
            expect(state.items).toEqual(mockItems);
        });

        it('fetchRawMaterials.rejected should set error', () => {
            const error = 'Failed to fetch';
            const state = rawMaterialsReducer(
                { ...initialState, loading: true },
                fetchRawMaterials.rejected(null, '', undefined, error)
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe(error);
        });

        it('createRawMaterial.pending should set loading', () => {
            const state = rawMaterialsReducer(initialState, createRawMaterial.pending('', { code: 'RM1', name: 'Mat 1' }));
            expect(state.loading).toBe(true);
        });

        it('createRawMaterial.fulfilled should add item to list', () => {
            const state = rawMaterialsReducer(
                { ...initialState, items: [mockMaterial] },
                createRawMaterial.fulfilled({ ...mockMaterial, id: '2' }, '', { code: 'RM2', name: 'Mat 2' })
            );
            expect(state.items).toHaveLength(2);
            expect(state.items[0].id).toBe('2');
        });

        it('createRawMaterial.rejected should set error', () => {
            const state = rawMaterialsReducer(
                initialState,
                createRawMaterial.rejected(null, '', { code: 'RM1', name: 'Mat 1' }, 'Error')
            );
            expect(state.error).toBe('Error');
        });

        it('updateRawMaterial.pending should set loading', () => {
            const state = rawMaterialsReducer(initialState, updateRawMaterial.pending('', { id: '1', data: {} }));
            expect(state.loading).toBe(true);
        });

        it('updateRawMaterial.fulfilled should update item in list', () => {
            const updated = { ...mockMaterial, name: 'Updated' };
            const state = rawMaterialsReducer(
                { ...initialState, items: [mockMaterial] },
                updateRawMaterial.fulfilled(updated, '', { id: '1', data: {} })
            );
            expect(state.items[0].name).toBe('Updated');
        });

        it('updateRawMaterial.fulfilled should notice if item is not found', () => {
            const updated = { ...mockMaterial, id: 'non-existent' };
            const state = rawMaterialsReducer(
                { ...initialState, items: [mockMaterial] },
                updateRawMaterial.fulfilled(updated, '', { id: 'non-existent', data: {} })
            );
            expect(state.items[0]).toEqual(mockMaterial);
        });

        it('updateRawMaterial.rejected should set error', () => {
            const state = rawMaterialsReducer(
                initialState,
                updateRawMaterial.rejected(null, '', { id: '1', data: {} }, 'Update Error')
            );
            expect(state.error).toBe('Update Error');
            expect(state.loading).toBe(false);
        });

        it('deleteRawMaterial.pending should set loading', () => {
            const state = rawMaterialsReducer(initialState, deleteRawMaterial.pending('', '1'));
            expect(state.loading).toBe(true);
        });

        it('deleteRawMaterial.fulfilled should remove item from list', () => {
            const state = rawMaterialsReducer(
                { ...initialState, items: [mockMaterial] },
                deleteRawMaterial.fulfilled('1', '', '1')
            );
            expect(state.items).toHaveLength(0);
        });

        it('deleteRawMaterial.rejected should set error', () => {
            const state = rawMaterialsReducer(
                initialState,
                deleteRawMaterial.rejected(null, '', '1', 'Delete Error')
            );
            expect(state.error).toBe('Delete Error');
            expect(state.loading).toBe(false);
        });
    });

    describe('thunk actions', () => {
        it('fetchRawMaterials thunk success', async () => {
            (rawMaterialsService.getAll as any).mockResolvedValueOnce({ data: [mockMaterial] });
            const dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchRawMaterials.fulfilled.type }));
        });

        it('fetchRawMaterials thunk failure', async () => {
            const errorMessage = 'API Error';
            (rawMaterialsService.getAll as any).mockRejectedValueOnce({
                response: { data: { message: errorMessage } }
            });
            const dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: fetchRawMaterials.rejected.type,
                payload: errorMessage
            }));
        });

        it('createRawMaterial thunk success', async () => {
            (rawMaterialsService.create as any).mockResolvedValueOnce({ data: mockMaterial });
            const dispatch = vi.fn();
            await createRawMaterial({ code: 'C1', name: 'N1' })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createRawMaterial.fulfilled.type }));
        });

        it('updateRawMaterial thunk success', async () => {
            (rawMaterialsService.update as any).mockResolvedValueOnce({ data: mockMaterial });
            const dispatch = vi.fn();
            await updateRawMaterial({ id: '1', data: {} })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: updateRawMaterial.fulfilled.type }));
        });

        it('deleteRawMaterial thunk success', async () => {
            (rawMaterialsService.delete as any).mockResolvedValueOnce({ data: {} });
            const dispatch = vi.fn();
            await deleteRawMaterial('1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteRawMaterial.fulfilled.type }));
        });

        it('thunks should handle errors for all actions', async () => {
            const errorMessage = 'Custom Error';
            const errorResponse = { response: { data: { message: errorMessage } } };

            // fetch
            (rawMaterialsService.getAll as any).mockRejectedValueOnce(errorResponse);
            let dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchRawMaterials.rejected.type, payload: errorMessage }));

            // create
            (rawMaterialsService.create as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await createRawMaterial({ code: 'C1', name: 'N1' })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: createRawMaterial.rejected.type, payload: errorMessage }));

            // update
            (rawMaterialsService.update as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await updateRawMaterial({ id: '1', data: {} })(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: updateRawMaterial.rejected.type, payload: errorMessage }));

            // delete
            (rawMaterialsService.delete as any).mockRejectedValueOnce(errorResponse);
            dispatch = vi.fn();
            await deleteRawMaterial('1')(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: deleteRawMaterial.rejected.type, payload: errorMessage }));
        });

        it('thunks should handle different error response structures for branch coverage', async () => {
            // err.response undefined
            (rawMaterialsService.getAll as any).mockRejectedValueOnce({});
            let dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                payload: 'Erro ao carregar matérias-primas'
            }));

            // err.response.data undefined
            (rawMaterialsService.getAll as any).mockRejectedValueOnce({ response: {} });
            dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                payload: 'Erro ao carregar matérias-primas'
            }));

            // err.response.data.message undefined
            (rawMaterialsService.getAll as any).mockRejectedValueOnce({ response: { data: {} } });
            dispatch = vi.fn();
            await fetchRawMaterials()(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                payload: 'Erro ao carregar matérias-primas'
            }));
        });
    });
});

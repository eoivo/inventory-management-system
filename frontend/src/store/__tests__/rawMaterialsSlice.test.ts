import { describe, it, expect, vi } from 'vitest';
import rawMaterialsReducer, {
    clearError,
    fetchRawMaterials,
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

    it('should return initial state', () => {
        expect(rawMaterialsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        expect(rawMaterialsReducer(state, clearError())).toEqual(initialState);
    });

    describe('async thunks', () => {
        it('fetchRawMaterials.fulfilled should update items', async () => {
            const mockMaterials = [
                { id: '1', code: 'RM1', name: 'Material 1', quantityInStock: 100, createdAt: '', updatedAt: '' }
            ];
            (rawMaterialsService.getAll as any).mockResolvedValueOnce({ data: mockMaterials });

            const dispatch = vi.fn();
            const thunk = fetchRawMaterials();
            await thunk(dispatch, () => ({}), {});

            const { calls } = dispatch.mock;
            expect(calls[1][0].type).toBe(fetchRawMaterials.fulfilled.type);
            expect(calls[1][0].payload).toEqual(mockMaterials);
        });
    });
});

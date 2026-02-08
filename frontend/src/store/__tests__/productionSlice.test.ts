import { describe, it, expect, vi, beforeEach } from 'vitest';
import productionReducer, {
    clearError,
    clearData,
    resetStatus,
    fetchProductionSuggestions
} from '../productionSlice';
import { productionService } from '../../services';

vi.mock('../../services', () => ({
    productionService: {
        getSuggestions: vi.fn()
    }
}));

describe('productionSlice', () => {
    const initialState = {
        data: null,
        loading: false,
        error: null,
    };

    const mockResponse = {
        suggestions: [],
        totalProductionValue: 0,
        timestamp: '2023-01-01'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', () => {
        expect(productionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'error' };
        expect(productionReducer(state, clearError())).toEqual(initialState);
    });

    it('should handle clearData', () => {
        const state = { ...initialState, data: mockResponse };
        expect(productionReducer(state, clearData())).toEqual(initialState);
    });

    it('should handle resetStatus', () => {
        const state = { ...initialState, loading: true, error: 'error' };
        expect(productionReducer(state, resetStatus())).toEqual(initialState);
    });

    describe('extraReducers', () => {
        it('fetchProductionSuggestions.pending should set loading', () => {
            const state = productionReducer(initialState, fetchProductionSuggestions.pending(''));
            expect(state.loading).toBe(true);
        });

        it('fetchProductionSuggestions.fulfilled should set data', () => {
            const state = productionReducer(initialState, fetchProductionSuggestions.fulfilled(mockResponse, ''));
            expect(state.loading).toBe(false);
            expect(state.data).toEqual(mockResponse);
        });

        it('fetchProductionSuggestions.rejected should set error', () => {
            const error = 'Failed to calculate';
            const state = productionReducer(
                initialState,
                fetchProductionSuggestions.rejected(null, '', undefined, error)
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe(error);
        });
    });

    describe('thunk actions', () => {
        it('fetchProductionSuggestions thunk success', async () => {
            (productionService.getSuggestions as any).mockResolvedValueOnce({ data: mockResponse });
            const dispatch = vi.fn();
            const thunk = fetchProductionSuggestions();
            await thunk(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProductionSuggestions.fulfilled.type }));
        });

        it('fetchProductionSuggestions thunk failure', async () => {
            const errorMessage = 'API Error';
            (productionService.getSuggestions as any).mockRejectedValueOnce({
                response: { data: { message: errorMessage } }
            });
            const dispatch = vi.fn();
            const thunk = fetchProductionSuggestions();
            await thunk(dispatch, () => ({}), {});
            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: fetchProductionSuggestions.rejected.type,
                payload: errorMessage
            }));
        });
    });
});

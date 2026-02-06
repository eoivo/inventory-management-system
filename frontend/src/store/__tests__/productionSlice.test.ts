import { describe, it, expect, vi } from 'vitest';
import productionReducer, {
    clearError,
    clearData,
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

    it('should return initial state', () => {
        expect(productionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('async thunks', () => {
        it('fetchProductionSuggestions.fulfilled should update data', async () => {
            const mockResponse = {
                suggestions: [],
                remainingStock: {}
            };
            (productionService.getSuggestions as any).mockResolvedValueOnce({ data: mockResponse });

            const dispatch = vi.fn();
            const thunk = fetchProductionSuggestions();
            await thunk(dispatch, () => ({}), {});

            const { calls } = dispatch.mock;
            expect(calls[1][0].type).toBe(fetchProductionSuggestions.fulfilled.type);
            expect(calls[1][0].payload).toEqual(mockResponse);
        });
    });
});

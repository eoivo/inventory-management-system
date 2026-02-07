import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productionService } from '../services';
import type { ProductionResponse } from '../services';

interface ProductionState {
    data: ProductionResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductionState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchProductionSuggestions = createAsyncThunk(
    'production/fetchSuggestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productionService.getSuggestions();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao calcular sugestões de produção'
            );
        }
    }
);

const productionSlice = createSlice({
    name: 'production',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearData: (state) => {
            state.data = null;
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductionSuggestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductionSuggestions.fulfilled, (state, action: PayloadAction<ProductionResponse>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProductionSuggestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearData, resetStatus } = productionSlice.actions;
export default productionSlice.reducer;

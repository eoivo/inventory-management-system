import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { rawMaterialsService } from '../services';
import type { RawMaterial } from '../services';

interface RawMaterialsState {
    items: RawMaterial[];
    selectedMaterial: RawMaterial | null;
    loading: boolean;
    error: string | null;
}

const initialState: RawMaterialsState = {
    items: [],
    selectedMaterial: null,
    loading: false,
    error: null,
};

export const fetchRawMaterials = createAsyncThunk(
    'rawMaterials/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await rawMaterialsService.getAll();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao carregar matérias-primas');
        }
    }
);

export const createRawMaterial = createAsyncThunk(
    'rawMaterials/create',
    async (data: { code: string; name: string; quantityInStock?: number }, { rejectWithValue }) => {
        try {
            const response = await rawMaterialsService.create(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao criar matéria-prima');
        }
    }
);

export const updateRawMaterial = createAsyncThunk(
    'rawMaterials/update',
    async (
        { id, data }: { id: string; data: { code?: string; name?: string; quantityInStock?: number } },
        { rejectWithValue }
    ) => {
        try {
            const response = await rawMaterialsService.update(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar matéria-prima');
        }
    }
);

export const deleteRawMaterial = createAsyncThunk(
    'rawMaterials/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await rawMaterialsService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao excluir matéria-prima');
        }
    }
);

const rawMaterialsSlice = createSlice({
    name: 'rawMaterials',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedMaterial: (state, action: PayloadAction<RawMaterial | null>) => {
            state.selectedMaterial = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRawMaterials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRawMaterials.fulfilled, (state, action: PayloadAction<RawMaterial[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchRawMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRawMaterial.fulfilled, (state, action: PayloadAction<RawMaterial>) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRawMaterial.fulfilled, (state, action: PayloadAction<RawMaterial>) => {
                state.loading = false;
                const index = state.items.findIndex((m) => m.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRawMaterial.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.items = state.items.filter((m) => m.id !== action.payload);
            })
            .addCase(deleteRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedMaterial } = rawMaterialsSlice.actions;
export default rawMaterialsSlice.reducer;

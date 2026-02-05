import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productMaterialsService, rawMaterialsService } from '../services';
import type { ProductMaterial, RawMaterial } from '../services';

interface ProductMaterialsState {
    items: ProductMaterial[];
    availableMaterials: RawMaterial[];
    loading: boolean;
    error: string | null;
    currentProductId: string | null;
}

const initialState: ProductMaterialsState = {
    items: [],
    availableMaterials: [],
    loading: false,
    error: null,
    currentProductId: null,
};

export const fetchProductMaterials = createAsyncThunk(
    'productMaterials/fetchByProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await productMaterialsService.getByProduct(productId);
            return { productId, materials: response.data };
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch product materials');
        }
    }
);

export const fetchAvailableMaterials = createAsyncThunk(
    'productMaterials/fetchAvailable',
    async (_, { rejectWithValue }) => {
        try {
            const response = await rawMaterialsService.getAll();
            return response.data;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch materials');
        }
    }
);

export const addProductMaterial = createAsyncThunk(
    'productMaterials/add',
    async ({ productId, rawMaterialId, quantityNeeded }: { productId: string; rawMaterialId: string; quantityNeeded: number }, { rejectWithValue }) => {
        try {
            const response = await productMaterialsService.add(productId, { rawMaterialId, quantityNeeded });
            return response.data;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to add material');
        }
    }
);

export const updateProductMaterial = createAsyncThunk(
    'productMaterials/update',
    async ({ productId, rawMaterialId, quantityNeeded }: { productId: string; rawMaterialId: string; quantityNeeded: number }, { rejectWithValue }) => {
        try {
            const response = await productMaterialsService.update(productId, rawMaterialId, { quantityNeeded });
            return response.data;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to update material');
        }
    }
);

export const removeProductMaterial = createAsyncThunk(
    'productMaterials/remove',
    async ({ productId, rawMaterialId }: { productId: string; rawMaterialId: string }, { rejectWithValue }) => {
        try {
            await productMaterialsService.remove(productId, rawMaterialId);
            return rawMaterialId;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to remove material');
        }
    }
);

const productMaterialsSlice = createSlice({
    name: 'productMaterials',
    initialState,
    reducers: {
        clearProductMaterials: (state) => {
            state.items = [];
            state.currentProductId = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Product Materials
            .addCase(fetchProductMaterials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductMaterials.fulfilled, (state, action: PayloadAction<{ productId: string; materials: ProductMaterial[] }>) => {
                state.loading = false;
                state.items = action.payload.materials;
                state.currentProductId = action.payload.productId;
            })
            .addCase(fetchProductMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Available Materials
            .addCase(fetchAvailableMaterials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAvailableMaterials.fulfilled, (state, action: PayloadAction<RawMaterial[]>) => {
                state.loading = false;
                state.availableMaterials = action.payload;
            })
            .addCase(fetchAvailableMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Material
            .addCase(addProductMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductMaterial.fulfilled, (state, action: PayloadAction<ProductMaterial>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addProductMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Material
            .addCase(updateProductMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductMaterial.fulfilled, (state, action: PayloadAction<ProductMaterial>) => {
                state.loading = false;
                const index = state.items.findIndex((m) => m.rawMaterialId === action.payload.rawMaterialId);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateProductMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove Material
            .addCase(removeProductMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProductMaterial.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.items = state.items.filter((m) => m.rawMaterialId !== action.payload);
            })
            .addCase(removeProductMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProductMaterials, clearError } = productMaterialsSlice.actions;
export default productMaterialsSlice.reducer;

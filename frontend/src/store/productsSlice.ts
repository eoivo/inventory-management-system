import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productsService } from '../services';
import type { Product, CreateProductDto, UpdateProductDto } from '../services';

interface ProductsState {
    items: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productsService.getAll();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao carregar produtos');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await productsService.getById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao carregar produto');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (data: CreateProductDto, { rejectWithValue }) => {
        try {
            const response = await productsService.create(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao criar produto');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }: { id: string; data: UpdateProductDto }, { rejectWithValue }) => {
        try {
            const response = await productsService.update(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao atualizar produto');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await productsService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao excluir produto');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch by id
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.selectedProduct?.id === action.payload.id) {
                    state.selectedProduct = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.items = state.items.filter((p) => p.id !== action.payload);
                if (state.selectedProduct?.id === action.payload) {
                    state.selectedProduct = null;
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;

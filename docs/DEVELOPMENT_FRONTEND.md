# Frontend Development Guide - Internal Documentation

## Architecture Overview

### Technology Stack
- **Framework:** React 19
- **Language:** TypeScript 5.x
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.x
- **UI Components:** Shadcn/UI
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Testing:** Jest + React Testing Library
- **Build Tool:** Vite

### Design Principles
1. **Component-Based Architecture**
2. **Feature-Sliced Design**
3. **Separation of Concerns**
4. **Reusability First**
5. **Type Safety**

---

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component
│   │
│   ├── features/                  # Feature modules
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── ProductDeleteDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProducts.ts
│   │   │   ├── store/
│   │   │   │   ├── productsSlice.ts
│   │   │   │   └── productsThunks.ts
│   │   │   └── types/
│   │   │       └── product.types.ts
│   │   │
│   │   ├── raw-materials/
│   │   │   ├── components/
│   │   │   │   ├── MaterialList.tsx
│   │   │   │   ├── MaterialForm.tsx
│   │   │   │   ├── MaterialCard.tsx
│   │   │   │   └── MaterialDeleteDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMaterials.ts
│   │   │   ├── store/
│   │   │   │   ├── materialsSlice.ts
│   │   │   │   └── materialsThunks.ts
│   │   │   └── types/
│   │   │       └── material.types.ts
│   │   │
│   │   ├── product-materials/
│   │   │   ├── components/
│   │   │   │   ├── MaterialAssociation.tsx
│   │   │   │   ├── MaterialSelector.tsx
│   │   │   │   └── AssociatedMaterialsList.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProductMaterials.ts
│   │   │   └── types/
│   │   │       └── product-material.types.ts
│   │   │
│   │   └── production/
│   │       ├── components/
│   │       │   ├── ProductionDashboard.tsx
│   │       │   ├── ProductionCard.tsx
│   │       │   ├── ProductionSummary.tsx
│   │       │   └── MaterialUsageTable.tsx
│   │       ├── hooks/
│   │       │   └── useProduction.ts
│   │       ├── store/
│   │       │   ├── productionSlice.ts
│   │       │   └── productionThunks.ts
│   │       └── types/
│   │           └── production.types.ts
│   │
│   ├── components/                # Shared components
│   │   ├── ui/                    # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── table.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   └── forms/
│   │       ├── FormField.tsx
│   │       ├── FormSelect.tsx
│   │       └── FormNumberInput.tsx
│   │
│   ├── store/                     # Redux store
│   │   ├── index.ts               # Store configuration
│   │   ├── rootReducer.ts         # Root reducer
│   │   └── hooks.ts               # Typed hooks
│   │
│   ├── services/                  # API services
│   │   ├── api.ts                 # Axios instance
│   │   ├── productsService.ts
│   │   ├── materialsService.ts
│   │   ├── productMaterialsService.ts
│   │   └── productionService.ts
│   │
│   ├── types/                     # Global types
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── hooks/                     # Global hooks
│   │   ├── useToast.ts
│   │   └── useDebounce.ts
│   │
│   ├── routes/                    # Routing configuration
│   │   └── index.tsx
│   │
│   └── styles/                    # Global styles
│       ├── globals.css
│       └── tailwind.css
│
├── public/
│   └── vite.svg
│
├── tests/
│   ├── components/
│   ├── features/
│   └── utils/
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Feature Implementation Details

### 1. Products Feature (RF005)

#### Product List Component
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from './store/productsThunks';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export function ProductList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (items.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Start by creating your first product"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Product Form Component
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Product } from './types/product.types';

const productSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code too long'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  value: z.number().positive('Value must be positive'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: product?.code || '',
      name: product?.name || '',
      value: product?.value || 0,
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handling managed by parent
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Code</FormLabel>
              <FormControl>
                <Input placeholder="PROD001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

#### Products Redux Slice
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product.types';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './productsThunks';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
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
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
```

#### Products Thunks
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '@/services/productsService';
import { Product, CreateProductDTO, UpdateProductDTO } from '../types/product.types';

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchAll',
  async () => {
    const response = await productsService.getAll();
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, CreateProductDTO>(
  'products/create',
  async (data) => {
    const response = await productsService.create(data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: UpdateProductDTO }
>('products/update', async ({ id, data }) => {
  const response = await productsService.update(id, data);
  return response.data;
});

export const deleteProduct = createAsyncThunk<string, string>(
  'products/delete',
  async (id) => {
    await productsService.delete(id);
    return id;
  }
);
```

---

### 2. Raw Materials Feature (RF006)

Similar structure to Products with appropriate adaptations:
- Material-specific fields: `quantityInStock`
- Stock management UI elements
- Validation for non-negative stock quantities

---

### 3. Product Materials Association (RF007)

#### Material Association Component
```typescript
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaterialAssociationProps {
  productId: string;
  onAssociate: (materialId: string, quantity: number) => Promise<void>;
}

export function MaterialAssociation({ productId, onAssociate }: MaterialAssociationProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const materials = useAppSelector((state) => state.materials.items);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMaterial || quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await onAssociate(selectedMaterial, quantity);
      setSelectedMaterial('');
      setQuantity(1);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material">Raw Material</Label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger id="material">
                <SelectValue placeholder="Select a material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Needed</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <Button type="submit" disabled={!selectedMaterial || quantity <= 0 || isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Material'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### Associated Materials List Component
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProductMaterial } from '../types/product-material.types';

interface AssociatedMaterialsListProps {
  materials: ProductMaterial[];
  onUpdate: (materialId: string, quantity: number) => Promise<void>;
  onRemove: (materialId: string) => Promise<void>;
}

export function AssociatedMaterialsList({
  materials,
  onUpdate,
  onRemove,
}: AssociatedMaterialsListProps) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No materials associated with this product yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Material Name</TableHead>
          <TableHead>Quantity Needed</TableHead>
          <TableHead>Stock Available</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) => (
          <TableRow key={material.id}>
            <TableCell className="font-mono">{material.rawMaterial.code}</TableCell>
            <TableCell>{material.rawMaterial.name}</TableCell>
            <TableCell>{material.quantityNeeded}</TableCell>
            <TableCell>{material.rawMaterial.quantityInStock}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(material.rawMaterialId)}
              >
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### 4. Production Dashboard (RF008)

#### Production Dashboard Component
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductionSuggestions } from './store/productionThunks';
import { ProductionCard } from './components/ProductionCard';
import { ProductionSummary } from './components/ProductionSummary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui/button';

export function ProductionDashboard() {
  const dispatch = useAppDispatch();
  const { suggestions, totalValue, loading, error } = useAppSelector(
    (state) => state.production
  );

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProductionSuggestions());
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production Suggestions</h1>
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>

      <ProductionSummary
        totalSuggestions={suggestions.length}
        totalValue={totalValue}
      />

      {suggestions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products can be produced with current stock levels.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <ProductionCard key={suggestion.productId} suggestion={suggestion} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Production Card Component
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductionSuggestion } from '../types/production.types';
import { formatCurrency } from '@/utils/formatters';

interface ProductionCardProps {
  suggestion: ProductionSuggestion;
}

export function ProductionCard({ suggestion }: ProductionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{suggestion.productName}</CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {suggestion.productCode}
            </p>
          </div>
          <Badge variant="secondary">
            {formatCurrency(suggestion.unitValue)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity to Produce:</span>
            <span className="font-semibold">{suggestion.quantityToProduce}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Value:</span>
            <span className="font-semibold text-lg">
              {formatCurrency(suggestion.totalValue)}
            </span>
          </div>
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground mb-2">Materials Used:</p>
            <ul className="space-y-1">
              {suggestion.materialsUsed.map((material) => (
                <li key={material.rawMaterialId} className="text-sm flex justify-between">
                  <span>{material.rawMaterialName}</span>
                  <span className="font-mono">{material.totalQuantityUsed}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## API Service Layer

### Axios Instance Configuration
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Products Service
```typescript
import api from './api';
import { Product, CreateProductDTO, UpdateProductDTO } from '@/features/products/types/product.types';

export const productsService = {
  getAll: () => api.get<Product[]>('/products'),
  
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  
  create: (data: CreateProductDTO) => api.post<Product>('/products', data),
  
  update: (id: string, data: UpdateProductDTO) => 
    api.put<Product>(`/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/products/${id}`),
};
```

---

## Redux Store Configuration

### Store Setup
```typescript
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/features/products/store/productsSlice';
import materialsReducer from '@/features/raw-materials/store/materialsSlice';
import productionReducer from '@/features/production/store/productionSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    materials: materialsReducer,
    production: productionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['production/fetchSuggestions/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## Routing Configuration

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductsPage } from '@/pages/ProductsPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { ProductionPage } from '@/pages/ProductionPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProductionPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'materials',
        element: <MaterialsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

---

## Utility Functions

### Formatters
```typescript
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
```

---

## Testing Strategy

### Component Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProductForm } from '../components/ProductForm';
import productsReducer from '../store/productsSlice';

const mockStore = configureStore({
  reducer: {
    products: productsReducer,
  },
});

describe('ProductForm', () => {
  it('renders all form fields', () => {
    render(
      <Provider store={mockStore}>
        <ProductForm onSubmit={jest.fn()} onCancel={jest.fn()} />
      </Provider>
    );

    expect(screen.getByLabelText(/product code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit value/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const onSubmit = jest.fn();
    
    render(
      <Provider store={mockStore}>
        <ProductForm onSubmit={onSubmit} onCancel={jest.fn()} />
      </Provider>
    );

    fireEvent.click(screen.getByText(/save product/i));

    await waitFor(() => {
      expect(screen.getByText(/code is required/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    
    render(
      <Provider store={mockStore}>
        <ProductForm onSubmit={onSubmit} onCancel={jest.fn()} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/product code/i), {
      target: { value: 'PROD001' },
    });
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByLabelText(/unit value/i), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByText(/save product/i));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        code: 'PROD001',
        name: 'Test Product',
        value: 100,
      });
    });
  });
});
```

---

## Environment Configuration

### .env.example
```env
VITE_API_URL=http://localhost:3000
```

---

## Build and Development

### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Development Commands
```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Tests
npm run test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

---

## Performance Optimization

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const MaterialsPage = lazy(() => import('@/pages/MaterialsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization
```typescript
import { memo, useMemo } from 'react';

export const ProductCard = memo(({ product }) => {
  const formattedValue = useMemo(
    () => formatCurrency(product.value),
    [product.value]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{formattedValue}</p>
      </CardContent>
    </Card>
  );
});
```

---

## Accessibility

### Focus Management
- Ensure proper tab order
- Add focus indicators
- Use semantic HTML
- Provide keyboard shortcuts

### ARIA Labels
```typescript
<button aria-label="Delete product" onClick={handleDelete}>
  <TrashIcon />
</button>
```

---

## Error Handling

### Error Boundary
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Build runs without errors
- [ ] No console errors in production
- [ ] Responsive on all devices
- [ ] Accessibility tested
- [ ] Performance optimized
- [ ] Error handling implemented

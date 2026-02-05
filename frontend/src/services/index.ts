import api from './api';

export interface Product {
    id: string;
    code: string;
    name: string;
    value: number;
    createdAt: string;
    updatedAt: string;
    materials?: ProductMaterial[];
}

export interface ProductMaterial {
    id: string;
    productId: string;
    rawMaterialId: string;
    quantityNeeded: number;
    rawMaterial: RawMaterial;
}

export interface RawMaterial {
    id: string;
    code: string;
    name: string;
    quantityInStock: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    code: string;
    name: string;
    value: number;
}

export interface UpdateProductDto {
    code?: string;
    name?: string;
    value?: number;
}

export const productsService = {
    getAll: () => api.get<Product[]>('/products'),
    getById: (id: string) => api.get<Product>(`/products/${id}`),
    create: (data: CreateProductDto) => api.post<Product>('/products', data),
    update: (id: string, data: UpdateProductDto) => api.put<Product>(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

export const rawMaterialsService = {
    getAll: () => api.get<RawMaterial[]>('/raw-materials'),
    getById: (id: string) => api.get<RawMaterial>(`/raw-materials/${id}`),
    create: (data: { code: string; name: string; quantityInStock?: number }) =>
        api.post<RawMaterial>('/raw-materials', data),
    update: (id: string, data: { code?: string; name?: string; quantityInStock?: number }) =>
        api.put<RawMaterial>(`/raw-materials/${id}`, data),
    delete: (id: string) => api.delete(`/raw-materials/${id}`),
};

export const productMaterialsService = {
    getByProduct: (productId: string) =>
        api.get<ProductMaterial[]>(`/products/${productId}/materials`),
    add: (productId: string, data: { rawMaterialId: string; quantityNeeded: number }) =>
        api.post<ProductMaterial>(`/products/${productId}/materials`, data),
    update: (productId: string, rawMaterialId: string, data: { quantityNeeded: number }) =>
        api.put<ProductMaterial>(`/products/${productId}/materials/${rawMaterialId}`, data),
    remove: (productId: string, rawMaterialId: string) =>
        api.delete(`/products/${productId}/materials/${rawMaterialId}`),
};

export interface ProductionSuggestion {
    productId: string;
    productCode: string;
    productName: string;
    unitValue: number;
    quantityToProduce: number;
    totalValue: number;
    materialsUsed: {
        rawMaterialId: string;
        rawMaterialCode: string;
        rawMaterialName: string;
        quantityNeeded: number;
        totalQuantityUsed: number;
    }[];
}

export interface ProductionResponse {
    suggestions: ProductionSuggestion[];
    totalProductionValue: number;
    timestamp: string;
}

export const productionService = {
    getSuggestions: () => api.get<ProductionResponse>('/production/suggestions'),
};

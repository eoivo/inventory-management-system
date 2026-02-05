import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import rawMaterialsReducer from './rawMaterialsSlice';
import productionReducer from './productionSlice';
import productMaterialsReducer from './productMaterialsSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        rawMaterials: rawMaterialsReducer,
        production: productionReducer,
        productMaterials: productMaterialsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

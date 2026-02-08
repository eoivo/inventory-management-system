import React from 'react';
import type { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import productsReducer from '../store/productsSlice';
import rawMaterialsReducer from '../store/rawMaterialsSlice';
import productionReducer from '../store/productionSlice';
import productMaterialsReducer from '../store/productMaterialsSlice';
import authReducer from '../store/authSlice';
import type { RootState } from '../store';

const rootReducer = combineReducers({
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    production: productionReducer,
    productMaterials: productMaterialsReducer,
    auth: authReducer,
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: any;
    initialEntries?: string[];
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = configureStore({
            reducer: rootReducer,
            preloadedState: preloadedState as any,
        }),
        initialEntries = ['/'],
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

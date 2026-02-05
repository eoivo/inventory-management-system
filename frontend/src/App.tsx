import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from './components/layout';
import { Dashboard, ProductsPage, MaterialsPage, ProductionPage, ProductMaterialsPage } from './pages';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:productId/materials" element={<ProductMaterialsPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="production" element={<ProductionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

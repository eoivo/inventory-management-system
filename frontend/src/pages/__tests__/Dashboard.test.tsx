import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { renderWithProviders } from '../../test/test-utils';
import { productsService, rawMaterialsService, productionService } from '../../services';

vi.mock('../../services', () => ({
    productsService: { getAll: vi.fn() },
    rawMaterialsService: { getAll: vi.fn() },
    productionService: { getSuggestions: vi.fn() },
}));

describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (productsService.getAll as any).mockResolvedValue({ data: [] });
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: [] });
        (productionService.getSuggestions as any).mockResolvedValue({
            data: { suggestions: [], totalProductionValue: 0, timestamp: new Date().toISOString() }
        });
    });
    it('should render stats correctly', () => {
        const preloadedState = {
            products: { items: [{}, {}], loading: false, error: null },
            rawMaterials: {
                items: [
                    { id: '1', name: 'M1', quantityInStock: 10 },
                    { id: '2', name: 'M2', quantityInStock: 20 }
                ],
                loading: false,
                error: null
            },
            production: {
                data: {
                    totalProductionValue: 500,
                    suggestions: [],
                    timestamp: new Date().toISOString()
                },
                loading: false,
                error: null
            },
        };

        renderWithProviders(<Dashboard />, { preloadedState: preloadedState as any });

        // Find cards by their labels and then look for values within them
        const productsCard = screen.getByText('Produtos Cadastrados').closest('.stat-card')!;
        const stockCard = screen.getByText('Itens em Estoque').closest('.stat-card')!;
        const valueCard = screen.getByText('Valor Total de Produção').closest('.stat-card')!;

        expect(within(productsCard as HTMLElement).getByText('2')).toBeInTheDocument();
        expect(within(stockCard as HTMLElement).getByText('30')).toBeInTheDocument();
        expect(within(valueCard as HTMLElement).getByText(/R\$\s*500,00/)).toBeInTheDocument();
    });

    it('should render production suggestions preview', () => {
        const preloadedState = {
            products: { items: [], loading: false, error: null },
            rawMaterials: { items: [], loading: false, error: null },
            production: {
                data: {
                    totalProductionValue: 100,
                    suggestions: [
                        { productId: '1', productName: 'Prod 1', productCode: 'P1', totalValue: 100, quantityToProduce: 1, unitValue: 100, materialsUsed: [] }
                    ],
                    timestamp: new Date().toISOString()
                },
                loading: false,
                error: null
            },
        };

        renderWithProviders(<Dashboard />, { preloadedState: preloadedState as any });

        expect(screen.getByText('Prod 1')).toBeInTheDocument();
        expect(screen.getByText('Código: P1')).toBeInTheDocument();
        expect(screen.getByText('1 unidades')).toBeInTheDocument();
    });

    it('should show empty message if no suggestions', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByText('Nenhuma sugestão de produção disponível')).toBeInTheDocument();
    });
});

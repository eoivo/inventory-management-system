import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductionPage } from '../ProductionPage';
import { renderWithProviders } from '../../test/test-utils';
import { productionService } from '../../services';

vi.mock('../../services', () => ({
    productionService: {
        getSuggestions: vi.fn()
    }
}));

describe('ProductionPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (productionService.getSuggestions as any).mockResolvedValue({
            data: { suggestions: [], totalProductionValue: 0, timestamp: new Date().toISOString() }
        });
    });

    it('should render page title and empty state', async () => {
        renderWithProviders(<ProductionPage />);

        expect(screen.getByText('Sugestões de Produção')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nenhuma sugestão disponível')).toBeInTheDocument();
        });
    });

    it('should show total value card and suggestions list', async () => {
        const mockData = {
            totalProductionValue: 1250.75,
            timestamp: new Date().toISOString(),
            suggestions: [
                {
                    productId: '1',
                    productCode: 'P1',
                    productName: 'Product 1',
                    unitValue: 250,
                    quantityToProduce: 5,
                    totalValue: 1250,
                    materialsUsed: [
                        { rawMaterialId: 'm1', rawMaterialName: 'Mat 1', quantityNeeded: 2, totalQuantityUsed: 10 }
                    ]
                }
            ]
        };
        (productionService.getSuggestions as any).mockResolvedValue({ data: mockData });

        renderWithProviders(<ProductionPage />);

        await waitFor(() => {
            expect(screen.getByText(/1\.250,75/)).toBeInTheDocument();
        });

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('5 unidades')).toBeInTheDocument();
        expect(screen.getByText(/1\.250,00/)).toBeInTheDocument();
    });

    it('should expand suggestion to show materials', async () => {
        const mockData = {
            totalProductionValue: 100,
            timestamp: new Date().toISOString(),
            suggestions: [
                {
                    productId: '1',
                    productCode: 'P1',
                    productName: 'Product 1',
                    unitValue: 100,
                    quantityToProduce: 1,
                    totalValue: 100,
                    materialsUsed: [
                        { rawMaterialId: 'm1', rawMaterialName: 'Mat 1', quantityNeeded: 2, totalQuantityUsed: 2 }
                    ]
                }
            ]
        };
        (productionService.getSuggestions as any).mockResolvedValue({ data: mockData });

        renderWithProviders(<ProductionPage />);

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        const cardHeader = screen.getByText('Product 1').closest('div[class*="flex"]')!;
        fireEvent.click(cardHeader);

        expect(screen.getByText('Materiais necessários')).toBeInTheDocument();
        expect(screen.getByText('Mat 1')).toBeInTheDocument();
        expect(screen.getByText('Total: 2')).toBeInTheDocument();
    });

    it('should call fetch on Recalcular button click', async () => {
        renderWithProviders(<ProductionPage />);

        await waitFor(() => {
            expect(screen.getByText('Recalcular')).toBeInTheDocument();
        });

        const refreshButton = screen.getByText('Recalcular');
        fireEvent.click(refreshButton);
        expect(productionService.getSuggestions).toHaveBeenCalled();
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ProductMaterialsPage } from '../ProductMaterialsPage';
import { renderWithProviders } from '../../test/test-utils';
import { productMaterialsService, productsService, rawMaterialsService } from '../../services';
import { Route, Routes } from 'react-router-dom';

vi.mock('../../services', () => ({
    productMaterialsService: {
        getByProduct: vi.fn(),
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn()
    },
    productsService: { getAll: vi.fn() },
    rawMaterialsService: { getAll: vi.fn() }
}));

describe('ProductMaterialsPage', () => {
    const mockProduct = { id: 'p1', code: 'P001', name: 'Product 1', value: 100 };
    const mockMaterials = [
        {
            id: 'pm1',
            productId: 'p1',
            rawMaterialId: 'm1',
            quantityNeeded: 2,
            rawMaterial: { id: 'm1', code: 'RM1', name: 'Mat 1', quantityInStock: 20 }
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (productsService.getAll as any).mockResolvedValue({ data: [mockProduct] });
        (productMaterialsService.getByProduct as any).mockResolvedValue({ data: mockMaterials });
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: [] });
    });

    it('should render product info and materials list', async () => {
        renderWithProviders(
            <Routes>
                <Route path="/products/:productId/materials" element={<ProductMaterialsPage />} />
            </Routes>,
            {
                initialEntries: ['/products/p1/materials']
            }
        );

        await waitFor(() => {
            expect(screen.getByText('P001 - Product 1')).toBeInTheDocument();
        });

        expect(screen.getByText('Mat 1')).toBeInTheDocument();
        expect(screen.getByText('2 por unidade')).toBeInTheDocument();
    });

    it('should show "Produto não encontrado" if ID is invalid', async () => {
        (productsService.getAll as any).mockResolvedValue({ data: [] });

        renderWithProviders(
            <Routes>
                <Route path="/products/:productId/materials" element={<ProductMaterialsPage />} />
            </Routes>,
            {
                initialEntries: ['/products/invalid/materials']
            }
        );

        await waitFor(() => {
            expect(screen.getByText('Produto não encontrado')).toBeInTheDocument();
        });
    });

    it('should open modal and add material', async () => {
        const available = [{ id: 'm2', code: 'RM2', name: 'Mat 2', quantityInStock: 50 }];
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: available });
        (productMaterialsService.add as any).mockResolvedValue({ data: { id: 'pm2' } });

        renderWithProviders(
            <Routes>
                <Route path="/products/:productId/materials" element={<ProductMaterialsPage />} />
            </Routes>,
            {
                initialEntries: ['/products/p1/materials']
            }
        );

        await waitFor(() => {
            expect(screen.getByText('Adicionar Material')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Adicionar Material'));

        expect(screen.getByText('Adicionar Material', { selector: 'h3' })).toBeInTheDocument();

        // Fill form
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'm2' } });
        fireEvent.change(screen.getByLabelText(/Quantidade/i), { target: { value: '5' } });

        fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

        await waitFor(() => {
            expect(productMaterialsService.add).toHaveBeenCalledWith('p1', {
                rawMaterialId: 'm2',
                quantityNeeded: 5
            });
        });
    });

    it('should remove material', async () => {
        (productMaterialsService.remove as any).mockResolvedValue({});
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(
            <Routes>
                <Route path="/products/:productId/materials" element={<ProductMaterialsPage />} />
            </Routes>,
            {
                initialEntries: ['/products/p1/materials']
            }
        );

        await waitFor(() => {
            expect(screen.getByText('Mat 1')).toBeInTheDocument();
        });

        const row = screen.getByText('Mat 1').closest('tr')!;
        const removeButton = within(row).getByTitle('Remover Material');

        fireEvent.click(removeButton);

        expect(window.confirm).toHaveBeenCalled();
        expect(productMaterialsService.remove).toHaveBeenCalledWith('p1', 'm1');
    });

    it('should update material quantity', async () => {
        (productMaterialsService.update as any).mockResolvedValue({ data: { ...mockMaterials[0], quantityNeeded: 10 } });

        renderWithProviders(
            <Routes>
                <Route path="/products/:productId/materials" element={<ProductMaterialsPage />} />
            </Routes>,
            {
                initialEntries: ['/products/p1/materials']
            }
        );

        await waitFor(() => {
            expect(screen.getByText('Mat 1')).toBeInTheDocument();
        });

        const row = screen.getByText('Mat 1').closest('tr')!;
        const editButton = within(row).getByTitle('Editar Quantidade');

        fireEvent.click(editButton);

        expect(screen.getByText('Editar Quantidade', { selector: 'h3' })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Quantidade/i), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

        await waitFor(() => {
            expect(productMaterialsService.update).toHaveBeenCalledWith('p1', 'm1', {
                quantityNeeded: 10
            });
        });
    });
});

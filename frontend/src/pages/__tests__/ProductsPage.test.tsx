import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ProductsPage } from '../ProductsPage';
import { renderWithProviders } from '../../test/test-utils';
import { productsService } from '../../services';

vi.mock('../../services', () => ({
    productsService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (productsService.getAll as any).mockResolvedValue({ data: [] });
    });

    it('should render page title and empty state', async () => {
        renderWithProviders(<ProductsPage />);
        expect(screen.getByText('Produtos')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Nenhum produto cadastrado')).toBeInTheDocument();
        });
    });

    it('should render list of products', async () => {
        const mockProducts = [
            { id: '1', code: 'P001', name: 'Product 1', value: 150.50, materials: [] },
            { id: '2', code: 'P002', name: 'Product 2', value: 200, materials: [{}, {}] }
        ];
        (productsService.getAll as any).mockResolvedValue({ data: mockProducts });

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('P001')).toBeInTheDocument();
        });

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText(/150,50/)).toBeInTheDocument();
        expect(screen.getByText('0 materiais')).toBeInTheDocument();

        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('2 materiais')).toBeInTheDocument();
    });

    it('should open modal when clicking "Novo Produto"', async () => {
        renderWithProviders(<ProductsPage />);
        await waitFor(() => {
            expect(screen.getByText('Novo Produto')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Novo Produto'));
        expect(screen.getByText('Novo Produto', { selector: 'h3' })).toBeInTheDocument();
    });

    it('should call create service on form submit', async () => {
        (productsService.create as any).mockResolvedValue({ data: { id: '3', code: 'P003', name: 'New Prod', value: 99.99 } });

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Novo Produto')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Novo Produto'));

        fireEvent.change(screen.getByPlaceholderText('Ex: PROD001'), { target: { value: 'P003' } });
        fireEvent.change(screen.getByPlaceholderText('Nome do produto'), { target: { value: 'New Prod' } });
        fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '99.99' } });

        fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

        await waitFor(() => {
            expect(productsService.create).toHaveBeenCalledWith({
                code: 'P003',
                name: 'New Prod',
                value: 99.99
            });
        });
    });

    it('should call delete service when clicking delete and confirming', async () => {
        const mockProducts = [{ id: '1', code: 'P001', name: 'Prod 1', value: 100, materials: [] }];
        (productsService.getAll as any).mockResolvedValue({ data: mockProducts });
        (productsService.delete as any).mockResolvedValue({});

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Prod 1')).toBeInTheDocument();
        });

        const row = screen.getByText('Prod 1').closest('tr')!;
        const deleteButton = within(row).getByTitle('Excluir Produto');
        fireEvent.click(deleteButton);

        // Verify the ConfirmModal is open
        expect(screen.getByText('Excluir Produto')).toBeInTheDocument();

        // Find and click the confirm button in the modal
        const confirmBtn = screen.getByRole('button', { name: 'Excluir' });
        fireEvent.click(confirmBtn);

        expect(productsService.delete).toHaveBeenCalledWith('1');
    });
});

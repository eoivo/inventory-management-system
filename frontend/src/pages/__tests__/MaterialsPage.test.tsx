import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MaterialsPage } from '../MaterialsPage';
import { renderWithProviders } from '../../test/test-utils';
import { rawMaterialsService } from '../../services';

vi.mock('../../services', () => ({
    rawMaterialsService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('MaterialsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: [] });
    });

    it('should render page title and empty state', async () => {
        renderWithProviders(<MaterialsPage />);
        expect(screen.getByText('Matérias-Primas')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Nenhuma matéria-prima cadastrada')).toBeInTheDocument();
        });
    });

    it('should render list of materials', async () => {
        const mockMaterials = [
            { id: '1', code: 'RM001', name: 'Material 1', quantityInStock: 100, unit: 'kg' },
            { id: '2', code: 'RM002', name: 'Material 2', quantityInStock: 10, unit: 'un' }
        ];
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: mockMaterials });

        renderWithProviders(<MaterialsPage />);

        await waitFor(() => {
            expect(screen.getByText('RM001')).toBeInTheDocument();
        });

        expect(screen.getByText('Material 1')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('kg')).toBeInTheDocument();
        expect(screen.getByText('Normal')).toBeInTheDocument(); // Badge status

        expect(screen.getByText('Material 2')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('un')).toBeInTheDocument();
        expect(screen.getByText('Baixo estoque')).toBeInTheDocument();
    });

    it('should show low stock alert if any material is low', async () => {
        const mockMaterials = [
            { id: '2', code: 'RM002', name: 'Material 2', quantityInStock: 10, unit: 'un' }
        ];
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: mockMaterials });

        renderWithProviders(<MaterialsPage />);

        await waitFor(() => {
            expect(screen.getByText('1 itens com estoque baixo')).toBeInTheDocument();
        });
    });

    it('should open modal when clicking "Nova Matéria-Prima"', async () => {
        renderWithProviders(<MaterialsPage />);
        await waitFor(() => {
            expect(screen.getByText('Nova Matéria-Prima')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Nova Matéria-Prima'));
        expect(screen.getByText('Nova Matéria-Prima', { selector: 'h3' })).toBeInTheDocument();
    });

    it('should call create service on form submit', async () => {
        (rawMaterialsService.create as any).mockResolvedValue({ data: { id: '3', code: 'NEW', name: 'New Material', quantityInStock: 50, unit: 'kg' } });

        renderWithProviders(<MaterialsPage />);

        await waitFor(() => {
            expect(screen.getByText('Nova Matéria-Prima')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Nova Matéria-Prima'));

        fireEvent.change(screen.getByPlaceholderText('Ex: RM001'), { target: { value: 'RM003' } });
        fireEvent.change(screen.getByPlaceholderText('Nome da matéria-prima'), { target: { value: 'Material 3' } });
        fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '50' } });

        // Change unit to kg
        const unitSelect = screen.getByLabelText('Unidade');
        fireEvent.change(unitSelect, { target: { value: 'kg' } });

        const submitButton = screen.getByRole('button', { name: 'Criar' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(rawMaterialsService.create).toHaveBeenCalledWith(expect.objectContaining({
                code: 'RM003',
                name: 'Material 3',
                quantityInStock: 50,
                unit: 'kg'
            }));
        });
    });

    it('should call delete service when clicking delete and confirming', async () => {
        const mockMaterials = [{ id: '1', code: 'RM001', name: 'Material 1', quantityInStock: 100, unit: 'un' }];
        (rawMaterialsService.getAll as any).mockResolvedValue({ data: mockMaterials });
        (rawMaterialsService.delete as any).mockResolvedValue({});
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<MaterialsPage />);

        // Wait for the material to be rendered from the mock call
        await waitFor(() => {
            expect(screen.getByText('Material 1')).toBeInTheDocument();
        });

        // Use within on the table row to be more precise
        const row = screen.getByText('Material 1').closest('tr')!;
        const deleteButton = within(row).getAllByRole('button').find((b: HTMLElement) => b.querySelector('.lucide-trash2'));

        fireEvent.click(deleteButton!);

        expect(window.confirm).toHaveBeenCalled();
        expect(rawMaterialsService.delete).toHaveBeenCalledWith('1');
    });
});

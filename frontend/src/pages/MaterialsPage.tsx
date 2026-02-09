import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { ConfirmModal } from '../components/ConfirmModal';
import {
    fetchRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
} from '../store/rawMaterialsSlice';
import type { RawMaterial } from '../services';

export function MaterialsPage() {
    const dispatch = useAppDispatch();
    const { items: materials, loading, error } = useAppSelector((state) => state.rawMaterials);
    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
    const [formData, setFormData] = useState<{
        code: string;
        name: string;
        quantityInStock: number | string;
        unit: string;
    }>({
        code: '',
        name: '',
        quantityInStock: 0,
        unit: 'un',
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    useEffect(() => {
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Sem estoque', class: 'badge-error' };
        if (quantity < 50) return { label: 'Baixo estoque', class: 'badge-warning' };
        return { label: 'Normal', class: 'badge-success' };
    };

    const handleOpenModal = (material?: RawMaterial) => {
        if (material) {
            setEditingMaterial(material);
            setFormData({
                code: material.code,
                name: material.name,
                unit: material.unit || 'un',
                quantityInStock: material.quantityInStock,
            });
        } else {
            setEditingMaterial(null);
            setFormData({ code: '', name: '', unit: 'un', quantityInStock: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMaterial(null);
        setFormData({ code: '', name: '', unit: 'un', quantityInStock: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            quantityInStock: Number(formData.quantityInStock) || 0,
        };
        try {
            if (editingMaterial) {
                await dispatch(updateRawMaterial({ id: editingMaterial.id, data: dataToSubmit })).unwrap();
            } else {
                await dispatch(createRawMaterial(dataToSubmit)).unwrap();
            }
            handleCloseModal();
        } catch {
            // Error is handled by Redux slice
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await dispatch(deleteRawMaterial(deleteModal.id)).unwrap();
            setDeleteModal({ isOpen: false, id: null });
        } catch {
            // Error is handled by Redux slice
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Matérias-Primas</h1>
                    <p className="page-description">Gerencie o estoque de matérias-primas</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4" />
                    Nova Matéria-Prima
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]">
                    {error}
                </div>
            )}

            {/* Low Stock Alert */}
            {materials.filter((m: RawMaterial) => m.quantityInStock < 50).length > 0 && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-warning-light))] border border-[hsl(var(--color-warning))] flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[hsl(var(--color-warning))]" />
                    <span className="text-[hsl(var(--color-warning))] font-medium">
                        {materials.filter((m: RawMaterial) => m.quantityInStock < 50).length} itens com estoque baixo
                    </span>
                </div>
            )}

            <div className="card p-0">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Quantidade em Estoque</th>
                                <th>Status</th>
                                <th className="text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && !materials.length ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[hsl(var(--color-primary))]" />
                                    </td>
                                </tr>
                            ) : materials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-[hsl(var(--color-text-secondary))]">
                                        Nenhuma matéria-prima cadastrada
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material: RawMaterial) => {
                                    const status = getStockStatus(material.quantityInStock);
                                    return (
                                        <tr key={material.id}>
                                            <td className="font-mono text-sm">{material.code.toUpperCase()}</td>
                                            <td className="font-medium">{material.name}</td>
                                            <td className="font-semibold">
                                                {material.quantityInStock} <span className="text-[hsl(var(--color-text-muted))] font-normal ml-1">{material.unit}</span>
                                            </td>
                                            <td>
                                                <span className={`badge ${status.class}`}>{status.label}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleOpenModal(material)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost btn-sm text-[hsl(var(--color-error))]"
                                                        onClick={() => handleDeleteClick(material.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingMaterial ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima'}
                            </h3>
                            <button className="btn btn-ghost btn-sm" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-4">
                                <div className="form-group">
                                    <label htmlFor="material-code" className="form-label">Código</label>
                                    <input
                                        id="material-code"
                                        type="text"
                                        className="form-input"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="Ex: RM001"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="material-name" className="form-label">Nome</label>
                                    <input
                                        id="material-name"
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nome da matéria-prima"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="material-quantity" className="form-label">Quantidade em Estoque</label>
                                        <input
                                            id="material-quantity"
                                            type="number"
                                            step="any"
                                            min="0"
                                            className="form-input"
                                            value={formData.quantityInStock}
                                            onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="material-unit" className="form-label">Unidade</label>
                                        <select
                                            id="material-unit"
                                            className="form-input"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            required
                                        >
                                            <option value="un">un (Unidade)</option>
                                            <option value="kg">kg (Quilograma)</option>
                                            <option value="g">g (Grama)</option>
                                            <option value="L">L (Litro)</option>
                                            <option value="ml">ml (Mililitro)</option>
                                            <option value="m">m (Metro)</option>
                                            <option value="m2">m² (Metro Quadrado)</option>
                                            <option value="pct">pct (Pacote)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingMaterial ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Excluir Matéria-Prima"
                message="Tem certeza que deseja excluir esta matéria-prima? Esta ação não pode ser desfeita e pode afetar produtos que dependem deste material."
                confirmText="Excluir"
                loading={loading}
            />
        </div>
    );
}

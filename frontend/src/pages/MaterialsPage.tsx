import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
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
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        quantityInStock: 0,
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
                quantityInStock: material.quantityInStock,
            });
        } else {
            setEditingMaterial(null);
            setFormData({ code: '', name: '', quantityInStock: 0 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMaterial(null);
        setFormData({ code: '', name: '', quantityInStock: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMaterial) {
                await dispatch(updateRawMaterial({ id: editingMaterial.id, data: formData })).unwrap();
            } else {
                await dispatch(createRawMaterial(formData)).unwrap();
            }
            handleCloseModal();
        } catch {
            // Error is handled by Redux slice
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta matéria-prima?')) {
            try {
                await dispatch(deleteRawMaterial(id)).unwrap();
            } catch {
                // Error is handled by Redux slice
            }
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
                                            <td className="font-mono text-sm">{material.code}</td>
                                            <td className="font-medium">{material.name}</td>
                                            <td className="font-semibold">{material.quantityInStock}</td>
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
                                                        onClick={() => handleDelete(material.id)}
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
                                    <label className="form-label">Código</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Ex: RM001"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nome da matéria-prima"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantidade em Estoque</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-input"
                                        value={formData.quantityInStock}
                                        onChange={(e) => setFormData({ ...formData, quantityInStock: parseInt(e.target.value) })}
                                        placeholder="0"
                                        required
                                    />
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
        </div>
    );
}

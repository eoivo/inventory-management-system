import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Package, Layers } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
    fetchProductMaterials,
    fetchAvailableMaterials,
    addProductMaterial,
    updateProductMaterial,
    removeProductMaterial,
} from '../store/productMaterialsSlice';
import { fetchProducts } from '../store/productsSlice';
import type { ProductMaterial, RawMaterial } from '../services';

export function ProductMaterialsPage() {
    const { productId } = useParams<{ productId: string }>();
    const dispatch = useAppDispatch();
    const { items: materials, availableMaterials, loading, error } = useAppSelector(
        (state) => state.productMaterials
    );
    const { items: products } = useAppSelector((state) => state.products);

    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<ProductMaterial | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [quantityNeeded, setQuantityNeeded] = useState(1);

    const product = products.find((p) => p.id === productId);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductMaterials(productId));
            dispatch(fetchAvailableMaterials());
        }
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, productId, products.length]);

    // Filter out already associated materials
    const unassociatedMaterials = availableMaterials.filter(
        (material: RawMaterial) => !materials.some((m) => m.rawMaterialId === material.id)
    );

    const handleOpenAddModal = () => {
        setEditingMaterial(null);
        setSelectedMaterialId(unassociatedMaterials[0]?.id || '');
        setQuantityNeeded(1);
        setShowModal(true);
    };

    const handleOpenEditModal = (material: ProductMaterial) => {
        setEditingMaterial(material);
        setSelectedMaterialId(material.rawMaterialId);
        setQuantityNeeded(material.quantityNeeded);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMaterial(null);
        setSelectedMaterialId('');
        setQuantityNeeded(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        try {
            if (editingMaterial) {
                await dispatch(
                    updateProductMaterial({
                        productId,
                        rawMaterialId: editingMaterial.rawMaterialId,
                        quantityNeeded,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    addProductMaterial({
                        productId,
                        rawMaterialId: selectedMaterialId,
                        quantityNeeded,
                    })
                ).unwrap();
            }
            handleCloseModal();
        } catch {
            // Error handled by Redux
        }
    };

    const handleRemove = async (rawMaterialId: string) => {
        if (!productId) return;
        if (window.confirm('Tem certeza que deseja remover este material do produto?')) {
            try {
                await dispatch(removeProductMaterial({ productId, rawMaterialId })).unwrap();
            } catch {
                // Error handled by Redux
            }
        }
    };

    if (!product && !loading) {
        return (
            <div className="page-container">
                <div className="card text-center py-12">
                    <Package className="w-12 h-12 text-[hsl(var(--color-text-muted))] mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-[hsl(var(--color-text-primary))]">
                        Produto não encontrado
                    </h2>
                    <Link to="/products" className="btn btn-primary mt-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Produtos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="btn btn-ghost btn-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="page-title">Materiais do Produto</h1>
                        <p className="page-description">
                            {product ? `${product.code} - ${product.name}` : 'Carregando...'}
                        </p>
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleOpenAddModal}
                    disabled={unassociatedMaterials.length === 0}
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Material
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]">
                    {error}
                </div>
            )}

            {unassociatedMaterials.length === 0 && materials.length > 0 && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-info-light))] text-[hsl(var(--color-info))] flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Todas as matérias-primas já estão associadas a este produto.
                </div>
            )}

            <div className="card p-0">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Quantidade Necessária</th>
                                <th>Estoque Disponível</th>
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
                                        <Layers className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--color-text-muted))]" />
                                        <p>Nenhum material associado a este produto</p>
                                        <p className="text-sm mt-1">
                                            Adicione materiais para que este produto possa ser produzido
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material: ProductMaterial) => (
                                    <tr key={material.rawMaterialId}>
                                        <td className="font-mono text-sm">{material.rawMaterial?.code}</td>
                                        <td className="font-medium">{material.rawMaterial?.name}</td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {material.quantityNeeded} por unidade
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${material.rawMaterial?.quantityInStock >= material.quantityNeeded
                                                        ? 'badge-success'
                                                        : 'badge-error'
                                                    }`}
                                            >
                                                {material.rawMaterial?.quantityInStock || 0} em estoque
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleOpenEditModal(material)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm text-[hsl(var(--color-error))]"
                                                    onClick={() => handleRemove(material.rawMaterialId)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                                {editingMaterial ? 'Editar Quantidade' : 'Adicionar Material'}
                            </h3>
                            <button className="btn btn-ghost btn-sm" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-4">
                                {!editingMaterial && (
                                    <div className="form-group">
                                        <label className="form-label">Matéria-Prima</label>
                                        <select
                                            className="form-input"
                                            value={selectedMaterialId}
                                            onChange={(e) => setSelectedMaterialId(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione uma matéria-prima</option>
                                            {unassociatedMaterials.map((material: RawMaterial) => (
                                                <option key={material.id} value={material.id}>
                                                    {material.code} - {material.name} (Estoque: {material.quantityInStock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {editingMaterial && (
                                    <div className="p-3 rounded-lg bg-[hsl(var(--color-surface))]">
                                        <p className="text-sm text-[hsl(var(--color-text-secondary))]">Material</p>
                                        <p className="font-medium">
                                            {editingMaterial.rawMaterial?.code} - {editingMaterial.rawMaterial?.name}
                                        </p>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Quantidade Necessária (por unidade do produto)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-input"
                                        value={quantityNeeded}
                                        onChange={(e) => setQuantityNeeded(parseInt(e.target.value) || 1)}
                                        required
                                    />
                                    <p className="text-sm text-[hsl(var(--color-text-secondary))] mt-1">
                                        Quantidade de matéria-prima necessária para produzir 1 unidade deste produto
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingMaterial ? 'Salvar' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

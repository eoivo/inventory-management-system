import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, Layers } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { formatCurrency } from '../utils/format';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../store/productsSlice';
import type { Product, CreateProductDto } from '../services';

export function ProductsPage() {
    const dispatch = useAppDispatch();
    const { items: products, loading, error } = useAppSelector((state) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<CreateProductDto>({
        code: '',
        name: '',
        value: 0,
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove tudo que não for dígito
        const rawValue = e.target.value.replace(/\D/g, '');

        // Converte para número e trata como centavos (ex: 150 -> 1.50)
        const numericValue = rawValue ? Number(rawValue) / 100 : 0;

        setFormData({ ...formData, value: numericValue });
    };

    const displayValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(formData.value);


    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                code: product.code,
                name: product.name,
                value: Number(product.value),
            });
        } else {
            setEditingProduct(null);
            setFormData({ code: '', name: '', value: 0 });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ code: '', name: '', value: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await dispatch(updateProduct({ id: editingProduct.id, data: formData })).unwrap();
            } else {
                await dispatch(createProduct(formData)).unwrap();
            }
            handleCloseModal();
        } catch {
            // Error is handled by Redux slice
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
            } catch {
                // Error is handled by Redux slice
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Produtos</h1>
                    <p className="page-description">Gerencie o catálogo de produtos</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4" />
                    Novo Produto
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]">
                    {error}
                </div>
            )}

            <div className="card p-0">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Valor Unitário</th>
                                <th>Materiais</th>
                                <th className="text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && !products.length ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[hsl(var(--color-primary))]" />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-[hsl(var(--color-text-secondary))]">
                                        Nenhum produto cadastrado
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: Product) => (
                                    <tr key={product.id}>
                                        <td className="font-mono text-sm">{product.code.toUpperCase()}</td>
                                        <td className="font-medium">{product.name}</td>
                                        <td>{formatCurrency(Number(product.value))}</td>
                                        <td>
                                            <Link
                                                to={`/products/${product.id}/materials`}
                                                className={`badge ${(product.materials?.length || 0) > 0 ? 'badge-success' : 'badge-warning'
                                                    } hover:opacity-80 transition-opacity cursor-pointer`}
                                            >
                                                <Layers className="w-3 h-3 mr-1" />
                                                {product.materials?.length || 0} materiais
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/products/${product.id}/materials`}
                                                    className="btn btn-ghost btn-sm"
                                                    title="Gerenciar Materiais"
                                                >
                                                    <Layers className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleOpenModal(product)}
                                                    title="Editar Produto"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm text-[hsl(var(--color-error))]"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Excluir Produto"
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
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h3>
                            <button className="btn btn-ghost btn-sm" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-4">
                                <div className="form-group">
                                    <label htmlFor="product-code" className="form-label">Código</label>
                                    <input
                                        id="product-code"
                                        type="text"
                                        className="form-input"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="Ex: PROD001"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-name" className="form-label">Nome</label>
                                    <input
                                        id="product-name"
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nome do produto"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="product-value" className="form-label">Valor Unitário</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))] font-medium">
                                            R$
                                        </span>
                                        <input
                                            id="product-value"
                                            type="text"
                                            className="form-input pl-10 w-full"
                                            value={formData.value === 0 && !editingProduct ? '' : displayValue}
                                            onChange={handleValueChange}
                                            placeholder="0,00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingProduct ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

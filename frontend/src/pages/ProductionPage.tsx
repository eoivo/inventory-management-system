import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, Loader2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProductionSuggestions, resetStatus } from '../store/productionSlice';
import type { ProductionSuggestion } from '../services';

export function ProductionPage() {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.production);
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

    useEffect(() => {
        dispatch(resetStatus());
        dispatch(fetchProductionSuggestions());
    }, [dispatch]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const toggleExpanded = (productId: string) => {
        setExpandedProducts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const handleRefresh = () => {
        dispatch(fetchProductionSuggestions());
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Sugestões de Produção</h1>
                    <p className="page-description">
                        Otimização baseada no estoque disponível, priorizando maior valor
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    Recalcular
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]">
                    {error}
                </div>
            )}

            {/* Total Value Card */}
            {data && (
                <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(250_87%_62%)] text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm opacity-90">Valor Total de Produção Sugerida</p>
                            <p className="text-3xl font-bold">{formatCurrency(data.totalProductionValue)}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm opacity-75">
                        Última atualização: {new Date(data.timestamp).toLocaleString('pt-BR')}
                    </p>
                </div>
            )}

            {/* Suggestions List */}
            {loading && !data ? (
                <div className="card flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--color-primary))]" />
                </div>
            ) : data && data.suggestions.length > 0 ? (
                <div className="space-y-4">
                    {data.suggestions.map((suggestion: ProductionSuggestion, index: number) => (
                        <div key={suggestion.productId} className="card">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleExpanded(suggestion.productId)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--color-primary-light))] flex items-center justify-center text-[hsl(var(--color-primary))] font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[hsl(var(--color-text-primary))]">
                                            {suggestion.productName}
                                        </h3>
                                        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                                            Código: {suggestion.productCode} | Valor unitário: {formatCurrency(suggestion.unitValue)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-[hsl(var(--color-success))]">
                                            {formatCurrency(suggestion.totalValue)}
                                        </p>
                                        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                                            {suggestion.quantityToProduce} unidades
                                        </p>
                                    </div>
                                    {expandedProducts.has(suggestion.productId) ? (
                                        <ChevronUp className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Materials Section */}
                            {expandedProducts.has(suggestion.productId) && (
                                <div className="mt-4 pt-4 border-t border-[hsl(var(--color-border))]">
                                    <h4 className="text-sm font-medium text-[hsl(var(--color-text-secondary))] mb-3">
                                        Materiais necessários
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {suggestion.materialsUsed.map((material) => (
                                            <div
                                                key={material.rawMaterialId}
                                                className="p-3 rounded-lg bg-[hsl(var(--color-surface))]"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Package className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
                                                    <span className="font-medium text-sm">{material.rawMaterialName}</span>
                                                </div>
                                                <p className="text-xs text-[hsl(var(--color-text-secondary))]">
                                                    {material.quantityNeeded} por unidade
                                                </p>
                                                <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">
                                                    Total: {material.totalQuantityUsed}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card flex flex-col items-center justify-center py-12 text-center">
                    <Package className="w-12 h-12 text-[hsl(var(--color-text-muted))] mb-4" />
                    <h3 className="text-lg font-medium text-[hsl(var(--color-text-primary))]">
                        Nenhuma sugestão disponível
                    </h3>
                    <p className="text-[hsl(var(--color-text-secondary))] mt-1">
                        Verifique se há produtos com materiais associados e estoque disponível
                    </p>
                </div>
            )}
        </div>
    );
}

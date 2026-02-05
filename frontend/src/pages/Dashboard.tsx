import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, Factory, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProducts } from '../store/productsSlice';
import { fetchRawMaterials } from '../store/rawMaterialsSlice';
import { fetchProductionSuggestions } from '../store/productionSlice';
import type { RawMaterial, ProductionSuggestion } from '../services';

export function Dashboard() {
    const dispatch = useAppDispatch();
    const { items: products } = useAppSelector((state) => state.products);
    const { items: materials } = useAppSelector((state) => state.rawMaterials);
    const { data: production } = useAppSelector((state) => state.production);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchRawMaterials());
        dispatch(fetchProductionSuggestions());
    }, [dispatch]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const stats = [
        {
            label: 'Produtos Cadastrados',
            value: products.length,
            icon: Package,
            color: 'bg-[hsl(var(--color-primary-light))] text-[hsl(var(--color-primary))]',
            link: '/products',
        },
        {
            label: 'Matérias-Primas',
            value: materials.length,
            icon: Layers,
            color: 'bg-[hsl(var(--color-success-light))] text-[hsl(var(--color-success))]',
            link: '/materials',
        },
        {
            label: 'Itens em Estoque',
            value: materials.reduce((sum: number, m: RawMaterial) => sum + m.quantityInStock, 0),
            icon: Factory,
            color: 'bg-[hsl(var(--color-warning-light))] text-[hsl(var(--color-warning))]',
            link: '/materials',
        },
        {
            label: 'Valor Total de Produção',
            value: formatCurrency(production?.totalProductionValue || 0),
            icon: TrendingUp,
            color: 'bg-[hsl(220_100%_97%)] text-[hsl(250_87%_62%)]',
            link: '/production',
        },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-description">
                        Visão geral do sistema de inventário
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <Link key={stat.label} to={stat.link} className="stat-card group hover:shadow-md transition-shadow">
                        <div className={`stat-icon ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[hsl(var(--color-text-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                ))}
            </div>

            {/* Production Suggestions Preview */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Sugestões de Produção</h2>
                    <Link to="/production" className="btn btn-ghost btn-sm">
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {production && production.suggestions.length > 0 ? (
                    <div className="space-y-3">
                        {production.suggestions.slice(0, 5).map((suggestion: ProductionSuggestion) => (
                            <div
                                key={suggestion.productId}
                                className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--color-surface))]"
                            >
                                <div>
                                    <p className="font-medium text-[hsl(var(--color-text-primary))]">
                                        {suggestion.productName}
                                    </p>
                                    <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                                        Código: {suggestion.productCode}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[hsl(var(--color-success))]">
                                        {formatCurrency(suggestion.totalValue)}
                                    </p>
                                    <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                                        {suggestion.quantityToProduce} unidades
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[hsl(var(--color-text-secondary))] text-center py-8">
                        Nenhuma sugestão de produção disponível
                    </p>
                )}
            </div>
        </div>
    );
}

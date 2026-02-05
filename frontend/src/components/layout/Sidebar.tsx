import { NavLink } from 'react-router-dom';
import { Package, Layers, Factory, LayoutDashboard } from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Produtos', icon: Package },
    { to: '/materials', label: 'Matérias-Primas', icon: Layers },
    { to: '/production', label: 'Produção', icon: Factory },
];

export function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-[hsl(var(--color-background))] border-r border-[hsl(var(--color-border))] p-4">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-[hsl(var(--color-text-primary))]">
                    Inventário
                </h1>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                    Sistema de Gestão
                </p>
            </div>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-[hsl(var(--color-primary))] text-white'
                                : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))] hover:text-[hsl(var(--color-text-primary))]'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

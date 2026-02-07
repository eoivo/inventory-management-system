import { NavLink, useNavigate } from 'react-router-dom';
import { Package, Layers, Factory, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout } from '../../store/authSlice';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Produtos', icon: Package },
    { to: '/materials', label: 'Matérias-Primas', icon: Layers },
    { to: '/production', label: 'Produção', icon: Factory },
];

export function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className="w-64 min-h-screen bg-[hsl(var(--color-background))] border-r border-[hsl(var(--color-border))] p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-[hsl(var(--color-text-primary))]">
                    Inventário
                </h1>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                    Sistema de Gestão
                </p>
            </div>

            <nav className="space-y-1 flex-1">
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

            <div className="mt-auto pt-4 border-t border-[hsl(var(--color-border))]">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-primary-light))] flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-[hsl(var(--color-text-primary))] truncate">
                            {user?.name || 'Usuário'}
                        </p>
                        <p className="text-xs text-[hsl(var(--color-text-secondary))] truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--color-error))] hover:bg-[hsl(var(--color-error-light))] transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sair do Sistema
                </button>
            </div>
        </aside>
    );
}

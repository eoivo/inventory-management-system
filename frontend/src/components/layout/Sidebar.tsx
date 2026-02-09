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

interface SidebarProps {
    isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-[hsl(var(--color-background))] border-r border-[hsl(var(--color-border))] p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(var(--color-text-primary))] tracking-tight">
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
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg shadow-blue-500/20'
                                : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))] hover:text-[hsl(var(--color-text-primary))]'
                            }`
                        }
                    >
                        <item.icon className={`w-5 h-5 transition-transform ${isOpen ? 'scale-110' : ''}`} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[hsl(var(--color-border))] -mx-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(var(--color-surface))] transition-colors cursor-default mb-2 group/user">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary-light))] to-[hsl(var(--color-primary))] p-[1.5px] group-hover/user:scale-105 transition-transform">
                        <div className="w-full h-full rounded-[10px] bg-[hsl(var(--color-background))] flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[hsl(var(--color-text-primary))] truncate leading-tight">
                            {user?.name || 'Usuário'}
                        </p>
                        <p className="text-[10px] text-[hsl(var(--color-text-secondary))] truncate mt-0.5">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[hsl(var(--color-error))] hover:bg-[hsl(var(--color-error-light))] transition-all duration-200 group/logout"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover/logout:-translate-x-1" />
                    <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login, clearError } from '../store/authSlice';
import { Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useAppSelector((state) => state.auth);
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        let timer: any;
        if (loading) {
            timer = setTimeout(() => setIsSlow(true), 3500);
        } else {
            setIsSlow(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[hsl(var(--color-surface))]">
            {/* Background Image with more presence */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/login-bg.jpg")',
                    opacity: 0.5
                }}
            />

            {/* Stronger overlay for better contrast */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />

            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center p-4 relative z-10">
                {/* Brand Section - Visible on Desktop */}
                <div className="hidden lg:flex flex-col text-white p-8">
                    <div className="w-20 h-20 bg-[hsl(var(--color-primary-light))] rounded-3xl flex items-center justify-center p-4 mb-8 border border-white/20 shadow-xl">
                        <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">
                        Industrial <br />
                        <span className="text-[hsl(var(--color-primary-light))] underline decoration-[hsl(var(--color-primary))] underline-offset-8">Inventory</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-sm leading-relaxed">
                        Sistema inteligente para gestão de estoque e otimização de produção industrial.
                    </p>
                </div>

                {/* Login Card */}
                <div className="card w-full max-w-md mx-auto p-8 lg:p-10 shadow-2xl bg-[hsl(var(--color-background)/0.95)] backdrop-blur-md border border-white/10">
                    <div className="text-center mb-8 lg:hidden">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-[hsl(var(--color-primary-light))] rounded-2xl flex items-center justify-center p-3">
                                <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-[hsl(var(--color-text-primary))]">Industrial Inventory</h1>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h2 className="text-2xl font-bold text-[hsl(var(--color-text-primary))]">Bem-vindo de volta</h2>
                        <p className="text-[hsl(var(--color-text-secondary))] mt-1">Acesse sua conta para continuar</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-[hsl(var(--color-error-light))] border border-[hsl(var(--color-error))] flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-[hsl(var(--color-error))]" />
                            <span className="text-[hsl(var(--color-error))] text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="admin@projedata.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                'Entrar no Sistema'
                            )}
                        </button>

                        {loading && isSlow && (
                            <p className="text-center text-xs text-[hsl(var(--color-text-secondary))] animate-pulse">
                                O servidor está sendo iniciado, isso pode levar alguns segundos...
                            </p>
                        )}
                    </form>

                    <div className="mt-8 pt-6 border-t border-[hsl(var(--color-border))] text-center">
                        <p className="text-xs text-[hsl(var(--color-text-muted))]">
                            Dica: Use as credenciais padrão do sistema para teste.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

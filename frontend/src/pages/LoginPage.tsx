import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login, clearError } from '../store/authSlice';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useAppSelector((state) => state.auth);

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
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--color-background))] p-4">
            <div className="card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-[hsl(var(--color-primary-light))] rounded-xl flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-[hsl(var(--color-primary))]" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--color-text-primary))]">Industrial Inventory</h1>
                    <p className="text-[hsl(var(--color-text-secondary))] mt-2">Acesse sua conta para gerenciar o estoque</p>
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
                </form>

                <div className="mt-8 pt-6 border-t border-[hsl(var(--color-border))] text-center">
                    <p className="text-xs text-[hsl(var(--color-text-muted))]">
                        Dica: Use as credenciais padrão do sistema para teste.
                    </p>
                </div>
            </div>
        </div>
    );
}

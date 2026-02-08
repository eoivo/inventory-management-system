import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { renderWithProviders } from '../../test/test-utils';
import * as authSlice from '../../store/authSlice';

// Mock axios with enough structure to satisfy api.ts initialization
vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn().mockReturnValue({
                interceptors: {
                    request: { use: vi.fn(), eject: vi.fn() },
                    response: { use: vi.fn(), eject: vi.fn() }
                }
            }),
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        }
    };
});

describe('LoginPage', () => {
    it('should render login form', () => {
        renderWithProviders(<LoginPage />);

        expect(screen.getByText('Industrial Inventory')).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar no Sistema/i })).toBeInTheDocument();
    });

    it('should dispatch login action on submit', async () => {
        const loginSpy = vi.spyOn(authSlice, 'login');
        renderWithProviders(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Entrar no Sistema/i }));

        expect(loginSpy).toHaveBeenCalled();
    });

    it('should show error message when login fails', () => {
        renderWithProviders(<LoginPage />, {
            preloadedState: {
                auth: { error: 'Invalid credentials', loading: false, user: null, token: null }
            } as any
        });

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        renderWithProviders(<LoginPage />, {
            preloadedState: {
                auth: { loading: true, error: null, user: null, token: null }
            } as any
        });

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show cold start message when loading is slow', async () => {
        vi.useFakeTimers();
        renderWithProviders(<LoginPage />, {
            preloadedState: {
                auth: { loading: true, error: null, user: null, token: null }
            } as any
        });

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.getByText(/O servidor está sendo iniciado/i)).toBeInTheDocument();

        act(() => {
            vi.useRealTimers();
        });
    });
});

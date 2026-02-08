import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { login, logout, clearError } from '../authSlice';
import axios from 'axios';

vi.mock('axios');

describe('authSlice', () => {
    const initialState = {
        user: null,
        token: null,
        loading: false,
        error: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should return initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle logout', () => {
        const state = {
            user: { id: '1', email: 'test@test.com', name: 'Test' },
            token: 'fake-token',
            loading: false,
            error: null,
        };
        const nextState = authReducer(state, logout());
        expect(nextState.user).toBeNull();
        expect(nextState.token).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle clearError', () => {
        const state = { ...initialState, error: 'some error' };
        const nextState = authReducer(state, clearError());
        expect(nextState.error).toBeNull();
    });

    describe('extraReducers', () => {
        it('login.pending should set loading', () => {
            const nextState = authReducer(initialState, login.pending('', { email: 't', password: 'p' }));
            expect(nextState.loading).toBe(true);
            expect(nextState.error).toBeNull();
        });

        it('login.fulfilled should update state', () => {
            const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
            const mockToken = 'token';
            const nextState = authReducer(
                { ...initialState, loading: true },
                login.fulfilled({ user: mockUser, token: mockToken }, '', {})
            );
            expect(nextState.loading).toBe(false);
            expect(nextState.user).toEqual(mockUser);
            expect(nextState.token).toBe(mockToken);
        });

        it('login.rejected should set error', () => {
            const nextState = authReducer(
                { ...initialState, loading: true },
                login.rejected(null, '', {}, 'Error Message')
            );
            expect(nextState.loading).toBe(false);
            expect(nextState.error).toBe('Error Message');
        });
    });

    describe('thunk actions', () => {
        it('login success thunk', async () => {
            const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
            const mockToken = 'fake-jwt';
            (axios.post as any).mockResolvedValueOnce({
                data: { user: mockUser, access_token: mockToken }
            });

            const dispatch = vi.fn();
            const thunk = login({ email: 'test@test.com', password: 'password' });
            await thunk(dispatch, () => ({}), {});

            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: login.fulfilled.type,
                payload: { user: mockUser, token: mockToken }
            }));
            expect(localStorage.getItem('token')).toBe(mockToken);
        });

        it('login failure thunk', async () => {
            (axios.post as any).mockRejectedValueOnce({
                response: { data: { message: 'Failed' } }
            });

            const dispatch = vi.fn();
            const thunk = login({ email: 't', password: 'p' });
            await thunk(dispatch, () => ({}), {});

            expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: login.rejected.type,
                payload: 'Failed'
            }));
        });
    });
});

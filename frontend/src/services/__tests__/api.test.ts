import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from '../api';

describe('api service', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have correct configuration', () => {
        expect(api.defaults.timeout).toBe(30000);
        expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    describe('request interceptor', () => {
        it('should add Authorization header if token exists in localStorage', async () => {
            const token = 'test-token';
            localStorage.setItem('token', token);

            // Access the request interceptor
            // @ts-ignore - access private interceptors for testing
            const requestInterceptor = api.interceptors.request.handlers[0] as any;
            const config = { headers: {} } as any;
            const result = await requestInterceptor.fulfilled(config);

            expect(result.headers.Authorization).toBe(`Bearer ${token}`);
        });

        it('should not add Authorization header if token does not exist', async () => {
            // @ts-ignore
            const requestInterceptor = api.interceptors.request.handlers[0] as any;
            const config = { headers: {} } as any;
            const result = await requestInterceptor.fulfilled(config);

            expect(result.headers.Authorization).toBeUndefined();
        });
    });

    describe('response interceptor', () => {
        it('should return response if successful', async () => {
            // @ts-ignore
            const responseInterceptor = api.interceptors.response.handlers[0] as any;
            const response = { status: 200, data: { success: true } } as any;
            const result = responseInterceptor.fulfilled(response);

            expect(result).toBe(response);
        });

        it('should handle 401 error and clear localStorage', async () => {
            localStorage.setItem('token', 'some-token');
            localStorage.setItem('user', 'some-user');

            // Mock window.location
            const locationMock = {
                href: 'http://localhost/dashboard',
            };
            vi.stubGlobal('location', locationMock);

            // @ts-ignore
            const responseInterceptor = api.interceptors.response.handlers[0] as any;
            const error = {
                response: {
                    status: 401,
                    data: { message: 'Unauthorized' }
                }
            };

            try {
                await responseInterceptor.rejected(error);
            } catch (e) {
                expect(localStorage.getItem('token')).toBeNull();
                expect(localStorage.getItem('user')).toBeNull();
                expect(locationMock.href).toBe('/login');
            }

            vi.unstubAllGlobals();
        });

        it('should handle other errors without clearing localStorage', async () => {
            localStorage.setItem('token', 'some-token');
            // @ts-ignore
            const responseInterceptor = api.interceptors.response.handlers[0] as any;
            const error = {
                response: {
                    status: 500,
                    data: { message: 'Server Error' }
                }
            };

            try {
                await responseInterceptor.rejected(error);
            } catch (e) {
                expect(localStorage.getItem('token')).toBe('some-token');
            }
        });
    });
});

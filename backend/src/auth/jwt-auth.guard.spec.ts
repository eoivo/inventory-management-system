import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if route is public', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

        const result = guard.canActivate(context);
        expect(result).toBe(true);
        expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should call super.canActivate if route is not public', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({}),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

        // Mocking the super.canActivate method by spying on the AuthGuard prototype
        const canActivateSpy = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockReturnValue(true);

        const result = guard.canActivate(context);

        expect(result).toBe(true);
        expect(canActivateSpy).toHaveBeenCalledWith(context);

        canActivateSpy.mockRestore();
    });
});

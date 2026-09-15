import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';

export const autenticacionGuard: CanActivateFn = () => {
    const autenticacion = inject(AutenticacionService);
    const router = inject(Router);
    return autenticacion.autenticado() ? true : router.createUrlTree(['/auth/login']);
};

export const rolGuard: CanActivateFn = (ruta: ActivatedRouteSnapshot) => {
    const autenticacion = inject(AutenticacionService);
    const router = inject(Router);
    const roles = (ruta.data['roles'] as string[] | undefined) ?? [];
    return roles.length === 0 || autenticacion.tieneRol(...roles)
        ? true
        : router.createUrlTree(['/panel']);
};

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

export const autenticacionInterceptor: HttpInterceptorFn = (solicitud, siguiente) => {
    const autenticacion = inject(AutenticacionService);
    const esAutenticacion = solicitud.url.includes('/api/autenticacion/');

    const enviar = (token: string | null) => {
        const solicitudAutenticada = token
            ? solicitud.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : solicitud;

        return siguiente(solicitudAutenticada).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !esAutenticacion) autenticacion.cerrarSesion();
                return throwError(() => error);
            })
        );
    };

    if (!esAutenticacion && autenticacion.token() && autenticacion.tokenExpiraPronto()) {
        return autenticacion.renovarSesion().pipe(
            switchMap(() => enviar(autenticacion.token())),
            catchError((error) => {
                autenticacion.cerrarSesion();
                return throwError(() => error);
            })
        );
    }

    return enviar(autenticacion.token());
};

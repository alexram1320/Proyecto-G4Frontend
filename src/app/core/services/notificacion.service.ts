import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../models/api.models';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    constructor(private readonly http: HttpClient) {}

    listar(limite = 30): Observable<RespuestaApi<Notificacion[]>> {
        return this.http.get<RespuestaApi<Notificacion[]>>(
            '/api/notificaciones',
            {
                params: { limite }
            }
        );
    }

    marcarLeida(id: string): Observable<RespuestaApi<boolean>> {
        return this.http.patch<RespuestaApi<boolean>>(
            `/api/notificaciones/${id}/leida`,
            {}
        );
    }
}
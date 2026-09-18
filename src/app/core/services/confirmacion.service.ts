import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,
} from '../models/api.models';
import { Confirmacion
} from '../models/confirmacion.models';

@Injectable({ providedIn: 'root' })
export class ConfirmacionService {
    constructor(private readonly http: HttpClient) {}

    listarConfirmaciones(reporteId: string): Observable<RespuestaApi<Confirmacion[]>> {
        return this.http.get<RespuestaApi<Confirmacion[]>>(`/api/reportes/${reporteId}/confirmaciones`);
    }

    confirmarReporte(reporteId: string): Observable<RespuestaApi<Confirmacion>> {
        return this.http.post<RespuestaApi<Confirmacion>>(`/api/reportes/${reporteId}/confirmaciones`, {});
    }
}

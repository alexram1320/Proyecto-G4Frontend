import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi
} from '../models/api.models';
import {
    DetalleResolucion,
    Resolucion
} from '../models/resolucion.models';

@Injectable({ providedIn: 'root' })
export class ApagonYaApiService {
    constructor(private readonly http: HttpClient) {}
    registrarResolucion(
        reporteId: string,
        solicitud: {
            causa: string;
            descripcion: string;
            fechaEstimadaResolucion: string | null;
            fechaRestablecimiento: string;
        }
    ): Observable<RespuestaApi<Resolucion>> {
        return this.http.post<RespuestaApi<Resolucion>>(`/api/reportes/${reporteId}/resolucion`, solicitud);
    }

    detalleResolucion(reporteId: string): Observable<RespuestaApi<DetalleResolucion>> {
        return this.http.get<RespuestaApi<DetalleResolucion>>(`/api/reportes/${reporteId}/resolucion`);
    }
}

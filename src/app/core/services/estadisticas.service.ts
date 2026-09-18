import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RespuestaApi } from '../models/api.models';

import {
    EstadisticasPanel,
    EstadisticasTendencia,
    EstadisticaTecnico,
    EstadisticaZona
} from '../models/estadisticas.model';

@Injectable({
    providedIn: 'root'
})
export class EstadisticasService {
    constructor(private readonly http: HttpClient) {}

    panel(
        filtros: Record<string, string> = {}
    ): Observable<RespuestaApi<EstadisticasPanel>> {
        return this.http.get<RespuestaApi<EstadisticasPanel>>(
            '/api/estadisticas/panel',
            {
                params: filtros
            }
        );
    }

    zonas(
        filtros: Record<string, string> = {}
    ): Observable<RespuestaApi<EstadisticaZona[]>> {
        return this.http.get<RespuestaApi<EstadisticaZona[]>>(
            '/api/estadisticas/zonas',
            {
                params: filtros
            }
        );
    }

    tecnicos(
        filtros: Record<string, string> = {}
    ): Observable<RespuestaApi<EstadisticaTecnico[]>> {
        return this.http.get<RespuestaApi<EstadisticaTecnico[]>>(
            '/api/estadisticas/tecnicos',
            {
                params: filtros
            }
        );
    }

    tendencias(
        agrupacion: 'semana' | 'mes',
        filtros: Record<string, string> = {}
    ): Observable<RespuestaApi<EstadisticasTendencia>> {
        return this.http.get<RespuestaApi<EstadisticasTendencia>>(
            '/api/estadisticas/tendencias',
            {
                params: {
                    ...filtros,
                    agrupacion
                }
            }
        );
    }
}
import {
    HttpClient,
    HttpParams
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    RespuestaApi,
    RespuestaPaginadaApi
} from '../models/api.models';

import {
    DashboardReporte,
    DashboardTecnico,
    DashboardZona,
    EstadoReporte
} from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private readonly http: HttpClient) {}

    listarZonas(
        incluirInactivas = true
    ): Observable<RespuestaApi<DashboardZona[]>> {
        return this.http.get<RespuestaApi<DashboardZona[]>>(
            '/api/zonas',
            {
                params: {
                    incluirInactivas
                }
            }
        );
    }

    listarTecnicos():
        Observable<RespuestaApi<DashboardTecnico[]>> {
        return this.http.get<RespuestaApi<DashboardTecnico[]>>(
            '/api/tecnicos'
        );
    }

    listarReportes(filtros: {
        pagina?: number;
        tamanoPagina?: number;
        estado?: EstadoReporte | null;
        zonaId?: string | null;
        tecnicoId?: string | null;
        fechaInicial?: string | null;
        fechaFinal?: string | null;
    }): Observable<RespuestaPaginadaApi<DashboardReporte>> {
        let params = new HttpParams()
            .set(
                'pagina',
                filtros.pagina ?? 1
            )
            .set(
                'tamanoPagina',
                filtros.tamanoPagina ?? 20
            );

        if (filtros.estado) {
            params = params.set(
                'estado',
                filtros.estado
            );
        }

        if (filtros.zonaId) {
            params = params.set(
                'zonaId',
                filtros.zonaId
            );
        }

        if (filtros.tecnicoId) {
            params = params.set(
                'tecnicoId',
                filtros.tecnicoId
            );
        }

        if (filtros.fechaInicial) {
            params = params.set(
                'fechaInicial',
                filtros.fechaInicial
            );
        }

        if (filtros.fechaFinal) {
            params = params.set(
                'fechaFinal',
                filtros.fechaFinal
            );
        }

        return this.http.get<
            RespuestaPaginadaApi<DashboardReporte>
        >(
            '/api/reportes',
            {
                params
            }
        );
    }
}
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,
    RespuestaPaginadaApi
} from '../models/api.models';
import {
    DetalleReporte,
    HistorialReporte,
    EstadoReporte,
    Reporte
}from '../models/reporte.models';

@Injectable({ providedIn: 'root' })
export class ApagonYaApiService {
    constructor(private readonly http: HttpClient) {}
    listarReportes(filtros: {
        pagina?: number;
        tamanoPagina?: number;
        estado?: EstadoReporte | null;
        zonaId?: string | null;
        tecnicoId?: string | null;
        fechaInicial?: string | null;
        fechaFinal?: string | null;
    }): Observable<RespuestaPaginadaApi<Reporte>> {
        let params = new HttpParams()
            .set('pagina', filtros.pagina ?? 1)
            .set('tamanoPagina', filtros.tamanoPagina ?? 20);

        if (filtros.estado) params = params.set('estado', filtros.estado);
        if (filtros.zonaId) params = params.set('zonaId', filtros.zonaId);
        if (filtros.tecnicoId) params = params.set('tecnicoId', filtros.tecnicoId);
        if (filtros.fechaInicial) params = params.set('fechaInicial', filtros.fechaInicial);
        if (filtros.fechaFinal) params = params.set('fechaFinal', filtros.fechaFinal);

        return this.http.get<RespuestaPaginadaApi<Reporte>>('/api/reportes', { params });
    }

    detalleReporte(id: string): Observable<RespuestaApi<DetalleReporte>> {
        return this.http.get<RespuestaApi<DetalleReporte>>(`/api/reportes/${id}`);
    }

    crearReporte(formulario: FormData): Observable<RespuestaApi<Reporte>> {
        return this.http.post<RespuestaApi<Reporte>>('/api/reportes', formulario);
    }

    actualizarReporte(
        id: string,
        direccionAproximada: string,
        fechaHoraInicio: string
    ): Observable<RespuestaApi<Reporte>> {
        return this.http.put<RespuestaApi<Reporte>>(`/api/reportes/${id}`, {
            direccionAproximada,
            fechaHoraInicio
        });
    }

    asignarTecnico(reporteId: string, tecnicoId: string): Observable<RespuestaApi<Reporte>> {
        return this.http.post<RespuestaApi<Reporte>>(`/api/reportes/${reporteId}/asignar`, {
            tecnicoId
        });
    }

    aceptarReporte(reporteId: string): Observable<RespuestaApi<Reporte>> {
        return this.http.post<RespuestaApi<Reporte>>(`/api/reportes/${reporteId}/aceptar`, {});
    }

    reasignarReporte(reporteId: string, tecnicoId: string): Observable<RespuestaApi<Reporte>> {
        return this.http.post<RespuestaApi<Reporte>>(`/api/reportes/${reporteId}/reasignar`, { tecnicoId });
    }

    historialReporte(reporteId: string): Observable<RespuestaApi<HistorialReporte[]>> {
        return this.http.get<RespuestaApi<HistorialReporte[]>>(`/api/reportes/${reporteId}/historial`);
    }

    cambiarEstadoReporte(
        reporteId: string,
        estado: EstadoReporte,
        descripcion: string | null
    ): Observable<RespuestaApi<Reporte>> {
        return this.http.patch<RespuestaApi<Reporte>>(`/api/reportes/${reporteId}/estado`, {
            estado,
            descripcion
        });
    }
}

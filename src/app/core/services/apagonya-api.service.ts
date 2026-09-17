import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Confirmacion,
    DetalleResolucion,
    DetalleReporte,
    HistorialReporte,
    EstadoReporte,
    Reporte,
    Resolucion,
    Tecnico,
    RespuestaApi,
    RespuestaPaginadaApi
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApagonYaApiService {
    constructor(private readonly http: HttpClient) {}

    listarTecnicos(): Observable<RespuestaApi<Tecnico[]>> {
        return this.http.get<RespuestaApi<Tecnico[]>>('/api/tecnicos');
    }

    obtenerTecnicoActual(): Observable<RespuestaApi<Tecnico>> {
        return this.http.get<RespuestaApi<Tecnico>>('/api/tecnicos/actual');
    }

    crearTecnico(solicitud: {
        nombre: string;
        email: string;
        contrasena: string;
        zonaId: string;
        disponible: boolean;
    }): Observable<RespuestaApi<Tecnico>> {
        return this.http.post<RespuestaApi<Tecnico>>('/api/tecnicos', solicitud);
    }

    actualizarTecnico(id: string, nombre: string): Observable<RespuestaApi<Tecnico>> {
        return this.http.put<RespuestaApi<Tecnico>>(`/api/tecnicos/${id}`, { nombre });
    }

    asignarZonaTecnico(id: string, zonaId: string): Observable<RespuestaApi<Tecnico>> {
        return this.http.patch<RespuestaApi<Tecnico>>(`/api/tecnicos/${id}/zona`, { zonaId });
    }

    cambiarDisponibilidadTecnico(id: string, disponible: boolean): Observable<RespuestaApi<Tecnico>> {
        return this.http.patch<RespuestaApi<Tecnico>>(`/api/tecnicos/${id}/disponibilidad`, {
            disponible
        });
    }

    cambiarEstadoTecnico(id: string, activo: boolean): Observable<RespuestaApi<Tecnico>> {
        return this.http.patch<RespuestaApi<Tecnico>>(`/api/tecnicos/${id}/estado`, { activo });
    }

    listarReportes(filtros: {
        pagina?: number;
        tamanoPagina?: number;
        estado?: EstadoReporte | null;
        zonaId?: string | null;
        tecnicoId?: string | null;
        fechaInicial?: string | null;
        fechaFinal?: string | null;
    }): Observable<RespuestaPaginadaApi<Reporte>> {
        let params = new HttpParams().set('pagina', filtros.pagina ?? 1).set('tamanoPagina', filtros.tamanoPagina ?? 20);

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

    listarConfirmaciones(reporteId: string): Observable<RespuestaApi<Confirmacion[]>> {
        return this.http.get<RespuestaApi<Confirmacion[]>>(`/api/reportes/${reporteId}/confirmaciones`);
    }

    confirmarReporte(reporteId: string): Observable<RespuestaApi<Confirmacion>> {
        return this.http.post<RespuestaApi<Confirmacion>>(`/api/reportes/${reporteId}/confirmaciones`, {});
    }

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

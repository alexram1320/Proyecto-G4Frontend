import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,
} from '../models/api.models';
import {
    Tecnico
} from '../models/tecnico.models';

@Injectable({ providedIn: 'root' })
export class TecnicoService {
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

    actualizarTecnico(id: string, nombre: string, email: string): Observable<RespuestaApi<Tecnico>> {
        return this.http.put<RespuestaApi<Tecnico>>(`/api/tecnicos/${id}`, { nombre, email });
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
}

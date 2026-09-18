import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,

} from '../models/api.models';

import { HorarioCorte}

    from '../models/HorarioCorte.model';
@Injectable({ providedIn: 'root' })

export class HorariosServices {

    constructor(private readonly http: HttpClient) {}


    listarHorarios(zonaId?: string | null, incluirInactivos = false): Observable<RespuestaApi<HorarioCorte[]>> {

    let params = new HttpParams().set('incluirInactivos', incluirInactivos);
    if (zonaId) params = params.set('zonaId', zonaId);
    return this.http.get<RespuestaApi<HorarioCorte[]>>('/api/horarios', { params });
}

crearHorario(solicitud: {
    zonaId: string;
    titulo: string;
    descripcion: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
}): Observable<RespuestaApi<HorarioCorte>> {
    return this.http.post<RespuestaApi<HorarioCorte>>('/api/horarios', solicitud);
}

actualizarHorario(
    id: string,
    solicitud: { zonaId: string; titulo: string; descripcion: string; fechaHoraInicio: string; fechaHoraFin: string }
): Observable<RespuestaApi<HorarioCorte>> {
    return this.http.put<RespuestaApi<HorarioCorte>>(`/api/horarios/${id}`, solicitud);
}

cambiarEstadoHorario(id: string, activo: boolean): Observable<RespuestaApi<HorarioCorte>> {
    return this.http.patch<RespuestaApi<HorarioCorte>>(`/api/horarios/${id}/estado`, { activo });
}
}

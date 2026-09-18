import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,

} from '../models/api.models';

import {Zona}

    from '../models/zona.model';
@Injectable({ providedIn: 'root' })

export class Zonas {

    constructor(private readonly http: HttpClient) {}


listarZonas(incluirInactivas = true): Observable<RespuestaApi<Zona[]>> {
    return this.http.get<RespuestaApi<Zona[]>>('/api/zonas', {
        params: { incluirInactivas }
    });
}

crearZona(nombre: string, descripcion: string): Observable<RespuestaApi<Zona>> {
    return this.http.post<RespuestaApi<Zona>>('/api/zonas', { nombre, descripcion });
}

actualizarZona(id: string, nombre: string, descripcion: string): Observable<RespuestaApi<Zona>> {
    return this.http.put<RespuestaApi<Zona>>(`/api/zonas/${id}`, { nombre, descripcion });
}

cambiarEstadoZona(id: string, activa: boolean): Observable<RespuestaApi<Zona>> {
    return this.http.patch<RespuestaApi<Zona>>(`/api/zonas/${id}/estado`, { activa });
}
}

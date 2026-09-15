import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, shareReplay, tap } from 'rxjs';
import { RespuestaApi, Sesion, Usuario } from '../models/api.models';
import { FirebaseRealtimeService } from './firebase-realtime.service';

const CLAVE_SESION = 'apagonya.sesion';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
    private readonly sesionSignal = signal<Sesion | null>(this.leerSesion());

    readonly sesion = this.sesionSignal.asReadonly();
    readonly usuario = computed(() => this.sesionSignal()?.usuario ?? null);
    readonly rol = computed(() => this.sesionSignal()?.usuario.rol ?? null);
    readonly autenticado = computed(() => this.sesionSignal() !== null);
    private renovacionEnCurso: Observable<RespuestaApi<Sesion>> | null = null;

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly firebase: FirebaseRealtimeService
    ) {}

    iniciarSesion(email: string, contrasena: string): Observable<RespuestaApi<Sesion>> {
        return this.http
            .post<RespuestaApi<Sesion>>('/api/autenticacion/sesion', { email, contrasena })
            .pipe(tap((respuesta) => this.guardarSesion(respuesta.datos)));
    }

    registrar(solicitud: {
        nombre: string;
        email: string;
        contrasena: string;
        zonaId: string | null;
    }): Observable<RespuestaApi<Usuario>> {
        return this.http.post<RespuestaApi<Usuario>>('/api/autenticacion/registro', solicitud);
    }

    recuperarContrasena(email: string): Observable<RespuestaApi<boolean>> {
        return this.http.post<RespuestaApi<boolean>>('/api/autenticacion/recuperar-contrasena', { email });
    }

    perfil(): Observable<RespuestaApi<Usuario>> {
        return this.http.get<RespuestaApi<Usuario>>('/api/autenticacion/perfil');
    }

    token(): string | null {
        return this.sesionSignal()?.token ?? null;
    }

    tokenExpiraPronto(): boolean {
        const expiraEn = this.sesionSignal()?.expiraEn;
        return !expiraEn || new Date(expiraEn).getTime() <= Date.now() + 60_000;
    }

    renovarSesion(): Observable<RespuestaApi<Sesion>> {
        if (this.renovacionEnCurso) return this.renovacionEnCurso;
        const tokenRenovacion = this.sesionSignal()?.tokenRenovacion ?? '';
        this.renovacionEnCurso = this.http
            .post<RespuestaApi<Sesion>>('/api/autenticacion/renovar', { tokenRenovacion })
            .pipe(
                tap((respuesta) => this.guardarSesion(respuesta.datos)),
                finalize(() => (this.renovacionEnCurso = null)),
                shareReplay(1)
            );
        return this.renovacionEnCurso;
    }

    tieneRol(...roles: string[]): boolean {
        return roles.includes(this.rol() ?? '');
    }

    cerrarSesion(): void {
        const finalizar = () => {
            void this.firebase.cerrarSesion();
            localStorage.removeItem(CLAVE_SESION);
            this.sesionSignal.set(null);
            void this.router.navigate(['/auth/login']);
        };

        if (!this.token()) {
            finalizar();
            return;
        }

        this.http.post('/api/autenticacion/cerrar-sesion', {}).subscribe({
            next: finalizar,
            error: finalizar
        });
    }

    private guardarSesion(sesion: Sesion): void {
        localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...sesion, tokenFirebase: '' }));
        this.sesionSignal.set(sesion);
        void this.firebase.iniciarSesion(sesion.tokenFirebase).catch(() => undefined);
    }

    private leerSesion(): Sesion | null {
        const valor = localStorage.getItem(CLAVE_SESION);

        if (!valor) {
            return null;
        }

        try {
            return JSON.parse(valor) as Sesion;
        } catch {
            localStorage.removeItem(CLAVE_SESION);
            return null;
        }
    }
}

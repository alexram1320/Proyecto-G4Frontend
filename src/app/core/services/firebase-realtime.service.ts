import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth, setPersistence, signInWithCustomToken, signOut } from 'firebase/auth';
import { Firestore, Unsubscribe, collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
import { ConfiguracionFirebasePublica, RespuestaApi, Usuario } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class FirebaseRealtimeService {
    private app: FirebaseApp | null = null;
    private auth: Auth | null = null;
    private firestore: Firestore | null = null;
    private configuracionEnCurso: Promise<void> | null = null;
    private inicioSesionEnCurso: Promise<void> | null = null;

    constructor(private readonly http: HttpClient) {}

    async iniciarSesion(tokenPersonalizado: string): Promise<void> {
        this.inicioSesionEnCurso = this.autenticar(tokenPersonalizado);
        try { await this.inicioSesionEnCurso; }
        finally { this.inicioSesionEnCurso = null; }
    }

    async cerrarSesion(): Promise<void> {
        if (this.auth) await signOut(this.auth);
    }

    async observarReportes(usuario: Usuario, alCambiar: () => void): Promise<Unsubscribe> {
        await this.asegurarConfiguracion();
        if (this.inicioSesionEnCurso) await this.inicioSesionEnCurso;
        if (!this.firestore || !this.auth) return () => undefined;
        await this.auth.authStateReady();
        const referencia = collection(this.firestore, 'reports');
        const consulta = usuario.rol === 'ADMIN' || !usuario.zonaId
            ? referencia
            : query(referencia, where('ZonaId', '==', usuario.zonaId));
        return onSnapshot(consulta, () => alCambiar(), () => undefined);
    }

    async observarNotificaciones(usuarioId: string, alCambiar: () => void): Promise<Unsubscribe> {
        await this.asegurarConfiguracion();
        if (this.inicioSesionEnCurso) await this.inicioSesionEnCurso;
        if (!this.firestore || !this.auth) return () => undefined;
        await this.auth.authStateReady();
        const consulta = query(collection(this.firestore, 'notifications'), where('UsuarioId', '==', usuarioId));
        return onSnapshot(consulta, () => alCambiar(), () => undefined);
    }

    private asegurarConfiguracion(): Promise<void> {
        if (this.app) return Promise.resolve();
        if (this.configuracionEnCurso) return this.configuracionEnCurso;
        this.configuracionEnCurso = firstValueFrom(
            this.http.get<RespuestaApi<ConfiguracionFirebasePublica>>('/api/configuracion/firebase')
        ).then((respuesta) => {
            const configuracion = respuesta.datos;
            this.app = getApps()[0] ?? initializeApp(configuracion);
            this.auth = getAuth(this.app);
            this.firestore = getFirestore(this.app);
        }).finally(() => (this.configuracionEnCurso = null));
        return this.configuracionEnCurso;
    }

    private async autenticar(tokenPersonalizado: string): Promise<void> {
        await this.asegurarConfiguracion();
        if (!this.auth) return;
        await setPersistence(this.auth, browserLocalPersistence);
        await signInWithCustomToken(this.auth, tokenPersonalizado);
    }
}

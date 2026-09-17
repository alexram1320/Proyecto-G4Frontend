export interface RespuestaApi<T> {
    exito: boolean;
    mensaje: string;
    errores: string[];
    datos: T;
    codigoEstado: number;
}

export interface RespuestaPaginadaApi<T> extends RespuestaApi<T[]> {
    pagina: number;
    tamanoPagina: number;
    total: number;
    totalPaginas: number;
}

export interface Usuario {
    id: string;
    firebaseUid: string;
    nombre: string;
    email: string;
    rol: string;
    zonaId: string | null;
    activo: boolean;
}

export interface Sesion {
    token: string;
    tokenRenovacion: string;
    tokenFirebase: string;
    expiraEn: string;
    usuario: Usuario;
}

export interface ConfiguracionFirebasePublica {
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
}

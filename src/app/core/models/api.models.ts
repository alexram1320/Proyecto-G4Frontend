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

export interface Tecnico {
    id: string;
    usuarioId: string;
    nombre: string;
    email: string;
    zonaId: string | null;
    disponible: boolean;
    estado: string;
    cargaReportesActivos: number;
    activo: boolean;
}

export type EstadoReporte = 'NEW' | 'IN_VERIFICATION' | 'CONFIRMED' | 'RESOLVED';

export interface Reporte {
    id: string;
    zonaId: string;
    ciudadanoId: string;
    tecnicoId: string | null;
    direccionAproximada: string;
    fechaHoraInicio: string;
    estado: EstadoReporte;
    urlEvidencia: string | null;
    cantidadConfirmaciones: number;
    fechaCreacion: string;
}

export interface DetalleReporte {
    reporte: Reporte;
    fechaActualizacion: string;
}

export interface Confirmacion {
    id: string;
    reporteId: string;
    ciudadanoId: string;
    fechaCreacion: string;
}

export interface Resolucion {
    id: string;
    reporteId: string;
    tecnicoId: string;
    causa: string;
    descripcion: string;
    fechaEstimadaResolucion: string | null;
    fechaRestablecimiento: string;
    fechaCreacion: string;
}

export interface DetalleResolucion {
    resolucion: Resolucion;
    estado: string;
}

export interface HistorialReporte {
    id: string;
    reporteId: string;
    estadoAnterior: EstadoReporte;
    estadoNuevo: EstadoReporte;
    usuarioCambioId: string;
    fechaHora: string;
    accion: string;
    descripcion: string;
}

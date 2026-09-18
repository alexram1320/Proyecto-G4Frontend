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

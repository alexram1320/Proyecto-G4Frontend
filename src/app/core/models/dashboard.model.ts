export type EstadoReporte =
    | 'NEW'
    | 'IN_VERIFICATION'
    | 'CONFIRMED'
    | 'RESOLVED';

export interface DashboardZona {
    id: string;
    nombre: string;
    descripcion: string;
    activa: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
}

export interface DashboardTecnico {
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

export interface DashboardReporte {
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
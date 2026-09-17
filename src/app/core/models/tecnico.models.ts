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

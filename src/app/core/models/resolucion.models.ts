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

export interface PuntoGrafico {
    etiqueta: string;
    valor: number;
}

export interface EstadisticasPanel {
    totalReportes: number;
    reportesActivos: number;
    reportesResueltos: number;
    sinVerificar: number;
    tiempoPromedioResolucionHoras: number;
    porEstado: PuntoGrafico[];
    porZona: PuntoGrafico[];
    tiempoPromedioPorTipoCorte: PuntoGrafico[];
}

export interface EstadisticaZona {
    zonaId: string;
    nombre: string;
    total: number;
    resueltos: number;
    porcentajeResuelto: number;
}

export interface EstadisticaTecnico {
    tecnicoId: string;
    nombre: string;
    total: number;
    resueltos: number;
    porcentajeResuelto: number;
}

export interface EstadisticasTendencia {
    etiquetas: string[];
    reportes: number[];
    resoluciones: number[];
}
export interface Notificacion {
    id: string;
    usuarioId: string;
    reporteId: string | null;
    tipo: string;
    titulo: string;
    mensaje: string;
    prioridad: 'NORMAL' | 'ALTA';
    leida: boolean;
    fechaCreacion: string;
}
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Tecnico } from '@/core/models/tecnico.models';
import { EstadoReporte, HistorialReporte, Reporte } from '@/core/models/reporte.models';
import { Resolucion } from '@/core/models/resolucion.models';
import { AutenticacionService } from '@/core/services/autenticacion.service';
import { Zona } from '@/core/models/zona.model';
import { FirebaseRealtimeService } from '@/core/services/firebase-realtime.service';
import { ReporteService } from '@/core/services/reporte.service';
import { TecnicoService } from '@/core/services/tecnico.service';
import { ConfirmacionService } from '@/core/services/confirmacion.service';
import { ResolucionService } from '@/core/services/resolucion.service';
import { ZonaService } from '@/core/services/Zona.services';

interface FormularioReporte {
    zonaId: string | null;
    direccionAproximada: string;
    fechaHoraInicio: string;
    evidencia: File | null;
}

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="m-0">Reportes de cortes</h2>
                    <p class="text-muted-color mt-2 mb-0">
                        Seguimiento desde el registro ciudadano hasta la resolución.
                    </p>
                </div>
                <p-button *ngIf="esCiudadano" label="Nuevo reporte" icon="pi pi-bolt" (onClick)="abrirNuevo()" />
            </div>

            <div class="grid grid-cols-12 gap-4 mb-6">
                <div class="col-span-12 md:col-span-3">
                    <p-select
                        [(ngModel)]="filtroZona"
                        [options]="zonas"
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder="Todas las zonas"
                        [showClear]="true"
                        fluid
                    />
                </div>
                <div class="col-span-12 md:col-span-3">
                    <p-select
                        [(ngModel)]="filtroEstado"
                        [options]="estados"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todos los estados"
                        [showClear]="true"
                        fluid
                    />
                </div>
                <div class="col-span-12 md:col-span-3">
                    <input
                        pInputText
                        type="date"
                        [(ngModel)]="filtroFechaInicial"
                        class="w-full"
                        aria-label="Fecha inicial"
                    />
                </div>
                <div class="col-span-12 md:col-span-3">
                    <input
                        pInputText
                        type="date"
                        [(ngModel)]="filtroFechaFinal"
                        class="w-full"
                        aria-label="Fecha final"
                    />
                </div>
                @if (esAdministrador) {
                    <div class="col-span-12 md:col-span-4">
                        <p-select
                            [(ngModel)]="filtroTecnico"
                            [options]="tecnicos"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Todos los técnicos"
                            [showClear]="true"
                            fluid
                        />
                    </div>
                }
                <div class="col-span-12 md:col-span-4">
                    <p-button label="Aplicar filtros" icon="pi pi-filter" severity="secondary" (onClick)="cargar()" />
                </div>
            </div>

            <p-table
                [value]="reportes"
                [loading]="cargando"
                [paginator]="true"
                [rows]="20"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th>Zona</th>
                        <th>Dirección</th>
                        <th>Inicio</th>
                        <th>Estado</th>
                        <th>Confirmaciones</th>
                        <th>Técnico</th>
                        <th style="min-width: 18rem">Acciones</th>
                    </tr>
                </ng-template>
                <ng-template #body let-reporte>
                    <tr>
                        <td>{{ nombreZona(reporte.zonaId) }}</td>
                        <td>{{ reporte.direccionAproximada }}</td>
                        <td>{{ reporte.fechaHoraInicio | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <p-tag
                                [value]="etiquetaEstado(reporte.estado)"
                                [severity]="severidadEstado(reporte.estado)"
                            />
                        </td>
                        <td>{{ reporte.cantidadConfirmaciones }}</td>
                        <td>{{ nombreTecnico(reporte.tecnicoId) }}</td>
                        <td class="whitespace-nowrap">
                            <p-button
                                icon="pi pi-eye"
                                rounded
                                text
                                (onClick)="verDetalle(reporte)"
                                aria-label="Ver detalle"
                            />
                            <p-button
                                *ngIf="puedeEditar(reporte)"
                                icon="pi pi-pencil"
                                rounded
                                text
                                (onClick)="abrirEdicion(reporte)"
                                aria-label="Editar"
                            />
                            <p-button
                                *ngIf="esAdministrador"
                                icon="pi pi-user-plus"
                                rounded
                                text
                                severity="secondary"
                                (onClick)="abrirAsignacion(reporte)"
                            />
                            <p-button
                                *ngIf="puedeAceptar(reporte)"
                                icon="pi pi-inbox"
                                rounded
                                text
                                severity="info"
                                (onClick)="aceptar(reporte)"
                                aria-label="Aceptar reporte"
                            />
                            <p-button
                                *ngIf="puedeReasignar(reporte)"
                                icon="pi pi-users"
                                rounded
                                text
                                severity="secondary"
                                (onClick)="abrirAsignacion(reporte)"
                                aria-label="Reasignar"
                            />
                            <p-button
                                *ngIf="puedeCambiarEstado(reporte)"
                                icon="pi pi-sync"
                                rounded
                                text
                                severity="warn"
                                (onClick)="abrirEstado(reporte)"
                                aria-label="Cambiar estado"
                            />
                            <p-button
                                *ngIf="puedeConfirmar(reporte)"
                                icon="pi pi-thumbs-up"
                                rounded
                                text
                                severity="info"
                                (onClick)="confirmar(reporte)"
                                aria-label="A mí también"
                            />
                            <p-button
                                *ngIf="puedeResolver(reporte)"
                                label="Registrar resolución"
                                icon="pi pi-check-circle"
                                text
                                severity="success"
                                (onClick)="abrirResolucion(reporte)"
                                aria-label="Registrar resolución"
                            />
                            @if (esTecnico && perfilTecnicoCargado && reporte.tecnicoId !== tecnicoActual?.id) {
                                <small class="text-muted-color ml-2">Asignado a otro técnico</small>
                            }
                            <p-button
                                icon="pi pi-history"
                                rounded
                                text
                                (onClick)="verHistorial(reporte)"
                                aria-label="Historial"
                            />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage
                    ><tr>
                        <td colspan="7" class="text-center py-8">No hay reportes para los filtros seleccionados.</td>
                    </tr></ng-template
                >
            </p-table>
        </div>

        <p-dialog
            [(visible)]="dialogoReporteVisible"
            [modal]="true"
            [style]="{ width: '38rem' }"
            [header]="reporteEditado ? 'Editar reporte' : 'Nuevo reporte'"
        >
            <div class="flex flex-col gap-5">
                @if (!reporteEditado) {
                    <div>
                        <label class="block font-semibold mb-2">Zona</label
                        ><p-select
                            [(ngModel)]="formulario.zonaId"
                            [options]="zonasActivas"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Seleccione una zona"
                            fluid
                        />
                    </div>
                }
                <div>
                    <label class="block font-semibold mb-2">Dirección aproximada</label
                    ><input pInputText [(ngModel)]="formulario.direccionAproximada" class="w-full" maxlength="300" />
                </div>
                <div>
                    <label class="block font-semibold mb-2">Fecha y hora de inicio</label
                    ><input pInputText type="datetime-local" [(ngModel)]="formulario.fechaHoraInicio" class="w-full" />
                </div>
                @if (!reporteEditado) {
                    <div>
                        <label class="block font-semibold mb-2">Evidencia fotográfica (opcional)</label
                        ><input
                            type="file"
                            accept="image/*"
                            (change)="seleccionarArchivo($event)"
                            class="block w-full"
                        />
                    </div>
                }
            </div>
            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="dialogoReporteVisible = false" />
                <p-button label="Guardar" icon="pi pi-check" [loading]="guardando" (onClick)="guardarReporte()" />
            </ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoAsignacionVisible"
            [modal]="true"
            [style]="{ width: '30rem' }"
            header="Asignar técnico"
        >
            <p-select
                appendTo="body"
                appendTo="body"
                [(ngModel)]="tecnicoSeleccionado"
                [options]="tecnicosDisponibles"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione un técnico"
                fluid
            />
            <small class="block mt-3 text-muted-color"
                >Solo se muestran técnicos activos y disponibles de la zona del reporte.</small
            >
            <ng-template #footer
                ><p-button
                    [label]="esTecnico ? 'Reasignar' : 'Asignar'"
                    icon="pi pi-user-plus"
                    (onClick)="asignarTecnico()"
            /></ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoEstadoVisible"
            [modal]="true"
            [style]="{ width: '32rem' }"
            header="Cambiar estado"
        >
            <div class="flex flex-col gap-5">
                <p-select
                    appendTo="body"
                    [(ngModel)]="estadoSeleccionado"
                    [options]="estadosGestionables"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione el estado"
                    fluid
                />
                <textarea
                    pTextarea
                    [(ngModel)]="descripcionEstado"
                    rows="3"
                    placeholder="Descripción del cambio"
                    class="w-full"
                ></textarea>
            </div>
            <ng-template #footer
                ><p-button label="Actualizar" icon="pi pi-sync" (onClick)="cambiarEstado()"
            /></ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoResolucionVisible"
            [modal]="true"
            [style]="{ width: '38rem' }"
            header="Registrar resolución"
        >
            <div class="flex flex-col gap-5">
                <div>
                    <label class="block font-semibold mb-2">Causa</label
                    ><input pInputText [(ngModel)]="causaResolucion" class="w-full" />
                </div>
                <div>
                    <label class="block font-semibold mb-2">Descripción</label
                    ><textarea pTextarea [(ngModel)]="descripcionResolucion" rows="4" class="w-full"></textarea>
                </div>
                <div>
                    <label class="block font-semibold mb-2">Fecha estimada de resolución</label
                    ><input pInputText type="datetime-local" [(ngModel)]="fechaEstimadaResolucion" class="w-full" />
                </div>
                <div>
                    <label class="block font-semibold mb-2">Fecha de restablecimiento</label
                    ><input pInputText type="datetime-local" [(ngModel)]="fechaRestablecimiento" class="w-full" />
                </div>
            </div>
            <ng-template #footer
                ><p-button
                    label="Resolver reporte"
                    icon="pi pi-check-circle"
                    severity="success"
                    (onClick)="registrarResolucion()"
            /></ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoHistorialVisible"
            [modal]="true"
            [style]="{ width: '46rem' }"
            header="Historial auditable"
        >
            <p-table [value]="historial" responsiveLayout="scroll">
                <ng-template #header
                    ><tr>
                        <th>Fecha</th>
                        <th>Acción</th>
                        <th>Cambio</th>
                        <th>Descripción</th>
                    </tr></ng-template
                >
                <ng-template #body let-item
                    ><tr>
                        <td>{{ item.fechaHora | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
                        <td>{{ item.accion }}</td>
                        <td>{{ etiquetaEstado(item.estadoAnterior) }} → {{ etiquetaEstado(item.estadoNuevo) }}</td>
                        <td>{{ item.descripcion }}</td>
                    </tr></ng-template
                >
            </p-table>
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoDetalleVisible"
            [modal]="true"
            [style]="{ width: '48rem' }"
            header="Detalle del reporte"
        >
            @if (detalleReporte) {
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Zona</span
                        ><strong>{{ nombreZona(detalleReporte.zonaId) }}</strong>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Estado</span
                        ><p-tag
                            [value]="etiquetaEstado(detalleReporte.estado)"
                            [severity]="severidadEstado(detalleReporte.estado)"
                        />
                    </div>
                    <div class="col-span-12">
                        <span class="block text-muted-color text-sm">Dirección aproximada</span
                        ><strong>{{ detalleReporte.direccionAproximada }}</strong>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Inicio del corte</span
                        >{{ detalleReporte.fechaHoraInicio | date: 'dd/MM/yyyy HH:mm' }}
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Confirmaciones ciudadanas</span
                        >{{ detalleReporte.cantidadConfirmaciones }}
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Técnico asignado</span
                        >{{ nombreTecnico(detalleReporte.tecnicoId) }}
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <span class="block text-muted-color text-sm">Evidencia</span>
                        @if (detalleReporte.urlEvidencia) {
                            <a [href]="detalleReporte.urlEvidencia" target="_blank" rel="noopener noreferrer"
                                >Abrir fotografía</a
                            >
                        } @else {
                            Sin evidencia
                        }
                    </div>
                </div>
                @if (resolucionDetalle) {
                    <div class="mt-6 pt-5 border-t border-surface-200 dark:border-surface-700">
                        <h3 class="mt-0">Resolución inmutable</h3>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6">
                                <span class="block text-muted-color text-sm">Causa</span
                                ><strong>{{ resolucionDetalle.causa }}</strong>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <span class="block text-muted-color text-sm">Restablecimiento</span
                                >{{ resolucionDetalle.fechaRestablecimiento | date: 'dd/MM/yyyy HH:mm:ss' }}
                            </div>
                            <div class="col-span-12">
                                <span class="block text-muted-color text-sm">Detalle</span
                                >{{ resolucionDetalle.descripcion }}
                            </div>
                            <div class="col-span-12">
                                <span class="block text-muted-color text-sm">Estimación registrada</span
                                >{{ resolucionDetalle.fechaEstimadaResolucion | date: 'dd/MM/yyyy HH:mm' }}
                            </div>
                        </div>
                    </div>
                }
            }
        </p-dialog>

        <p-dialog
            [(visible)]="dialogoDuplicadoVisible"
            [modal]="true"
            [style]="{ width: '32rem' }"
            header="Ya existe un reporte activo"
        >
            <p>
                El nuevo reporte fue bloqueado. Puede confirmar el reporte activo de esta zona mediante “A mí también”.
            </p>
            <ng-template #footer>
                <p-button label="Cerrar" severity="secondary" text (onClick)="dialogoDuplicadoVisible = false" />
                <p-button label="A mí también" icon="pi pi-thumbs-up" (onClick)="confirmarDuplicado()" />
            </ng-template>
        </p-dialog>
    `
})
export class ReportesPage implements OnInit, OnDestroy {
    readonly estados = [
        { label: 'Nuevo', value: 'NEW' as EstadoReporte },
        { label: 'En verificación', value: 'IN_VERIFICATION' as EstadoReporte },
        { label: 'Confirmado', value: 'CONFIRMED' as EstadoReporte },
        { label: 'Resuelto', value: 'RESOLVED' as EstadoReporte }
    ];
    readonly estadosGestionables = this.estados.filter((estado) => estado.value !== 'RESOLVED');

    reportes: Reporte[] = [];
    zonas: Zona[] = [];
    tecnicos: Tecnico[] = [];
    tecnicoActual: Tecnico | null = null;
    perfilTecnicoCargado = false;
    filtroZona: string | null = null;
    filtroEstado: EstadoReporte | null = null;
    filtroTecnico: string | null = null;
    filtroFechaInicial = '';
    filtroFechaFinal = '';
    reporteEditado: Reporte | null = null;
    reporteSeleccionado: Reporte | null = null;
    formulario: FormularioReporte = this.formularioVacio();
    tecnicoSeleccionado: string | null = null;
    estadoSeleccionado: EstadoReporte | null = null;
    descripcionEstado = '';
    causaResolucion = '';
    descripcionResolucion = '';
    fechaRestablecimiento = '';
    fechaEstimadaResolucion = '';
    historial: HistorialReporte[] = [];
    detalleReporte: Reporte | null = null;
    resolucionDetalle: Resolucion | null = null;
    reporteDuplicadoId: string | null = null;
    dialogoReporteVisible = false;
    dialogoAsignacionVisible = false;
    dialogoEstadoVisible = false;
    dialogoResolucionVisible = false;
    dialogoHistorialVisible = false;
    dialogoDetalleVisible = false;
    dialogoDuplicadoVisible = false;
    cargando = false;
    guardando = false;
    private cancelarTiempoReal: (() => void) | null = null;

    get esAdministrador(): boolean {
        return this.autenticacion.tieneRol('ADMIN');
    }
    get esTecnico(): boolean {
        return this.autenticacion.tieneRol('TECHNICIAN');
    }
    get esCiudadano(): boolean {
        return this.autenticacion.tieneRol('CITIZEN');
    }
    get zonasActivas(): Zona[] {
        const zonaUsuario = this.autenticacion.usuario()?.zonaId;
        return this.zonas.filter((zona) => zona.activa && (!this.esCiudadano || zona.id === zonaUsuario));
    }

    get tecnicosDisponibles(): Tecnico[] {
        return this.tecnicos.filter(
            (tecnico) =>
                tecnico.activo &&
                tecnico.disponible &&
                tecnico.zonaId === this.reporteSeleccionado?.zonaId &&
                (!this.esTecnico || tecnico.id !== this.tecnicoActual?.id)
        );
    }

    constructor(
        private readonly reporte: ReporteService,
        private readonly tecnico: TecnicoService,
        private readonly confirmacion: ConfirmacionService,
        private readonly resolucion: ResolucionService,
        public readonly autenticacion: AutenticacionService,
        private readonly firebase: FirebaseRealtimeService,
        private readonly mensajes: MessageService,
        private readonly zona: ZonaService
    ) {}

    ngOnInit(): void {
        this.zona.listarZonas(true).subscribe((respuesta) => (this.zonas = respuesta.datos));
        this.tecnico
            .listarTecnicos()
            .subscribe({ next: (respuesta) => (this.tecnicos = respuesta.datos), error: () => (this.tecnicos = []) });
        if (this.esTecnico) {
            this.tecnico.obtenerTecnicoActual().subscribe({
                next: (respuesta) => {
                    this.tecnicoActual = respuesta.datos;
                    this.perfilTecnicoCargado = true;
                },
                error: (error: HttpErrorResponse) => {
                    this.perfilTecnicoCargado = true;
                    this.mensajes.add({
                        severity: 'error',
                        summary: 'Perfil técnico no vinculado',
                        detail: error.error?.mensaje ?? 'No se pudo identificar el perfil del técnico conectado.'
                    });
                }
            });
        }
        this.cargar();
        const usuario = this.autenticacion.usuario();
        if (usuario) {
            void this.firebase
                .observarReportes(usuario, () => this.cargar())
                .then((cancelar) => (this.cancelarTiempoReal = cancelar));
        }
    }

    ngOnDestroy(): void {
        this.cancelarTiempoReal?.();
    }

    cargar(): void {
        this.cargando = true;
        this.reporte
            .listarReportes({
                zonaId: this.filtroZona,
                estado: this.filtroEstado,
                tecnicoId: this.filtroTecnico,
                fechaInicial: this.filtroFechaInicial
                    ? new Date(`${this.filtroFechaInicial}T00:00:00`).toISOString()
                    : null,
                fechaFinal: this.filtroFechaFinal ? new Date(`${this.filtroFechaFinal}T23:59:59`).toISOString() : null,
                tamanoPagina: 100
            })
            .subscribe({
                next: (respuesta) => {
                    this.reportes = respuesta.datos;
                    this.cargando = false;
                },
                error: (error) => this.mostrarError(error)
            });
    }

    abrirNuevo(): void {
        this.reporteEditado = null;
        this.formulario = this.formularioVacio();
        this.formulario.zonaId = this.autenticacion.usuario()?.zonaId ?? null;
        this.dialogoReporteVisible = true;
    }

    abrirEdicion(reporte: Reporte): void {
        this.reporteEditado = reporte;
        this.formulario = {
            zonaId: reporte.zonaId,
            direccionAproximada: reporte.direccionAproximada,
            fechaHoraInicio: this.fechaLocal(reporte.fechaHoraInicio),
            evidencia: null
        };
        this.dialogoReporteVisible = true;
    }

    seleccionarArchivo(evento: Event): void {
        const archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
        if (archivo && !['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
            (evento.target as HTMLInputElement).value = '';
            this.formulario.evidencia = null;
            return this.advertir('La evidencia debe ser una imagen JPG, PNG o WEBP.');
        }
        if (archivo && archivo.size > 8_000_000) {
            (evento.target as HTMLInputElement).value = '';
            this.formulario.evidencia = null;
            return this.advertir('La evidencia no puede superar 8 MB.');
        }
        this.formulario.evidencia = archivo;
    }

    guardarReporte(): void {
        if (!this.formulario.direccionAproximada.trim() || !this.formulario.fechaHoraInicio)
            return this.advertir('Complete la dirección y la fecha de inicio.');

        this.guardando = true;
        const fecha = new Date(this.formulario.fechaHoraInicio).toISOString();
        const operacion = this.reporteEditado
            ? this.reporte.actualizarReporte(this.reporteEditado.id, this.formulario.direccionAproximada.trim(), fecha)
            : this.crearReporte(fecha);

        operacion.subscribe({
            next: (respuesta) => this.completado(respuesta.mensaje, 'reporte'),
            error: (error) => this.mostrarError(error)
        });
    }

    abrirAsignacion(reporte: Reporte): void {
        this.reporteSeleccionado = reporte;
        this.tecnicoSeleccionado = reporte.tecnicoId;
        this.dialogoAsignacionVisible = true;
    }

    asignarTecnico(): void {
        if (!this.reporteSeleccionado || !this.tecnicoSeleccionado) return this.advertir('Seleccione un técnico.');
        const operacion = this.esTecnico
            ? this.reporte.reasignarReporte(this.reporteSeleccionado.id, this.tecnicoSeleccionado)
            : this.reporte.asignarTecnico(this.reporteSeleccionado.id, this.tecnicoSeleccionado);
        operacion.subscribe({
            next: (r) => this.completado(r.mensaje, 'asignacion'),
            error: (e) => this.mostrarError(e)
        });
    }

    aceptar(reporte: Reporte): void {
        this.reporte
            .aceptarReporte(reporte.id)
            .subscribe({ next: (r) => this.completado(r.mensaje), error: (e) => this.mostrarError(e) });
    }

    abrirEstado(reporte: Reporte): void {
        this.reporteSeleccionado = reporte;
        this.estadoSeleccionado = null;
        this.descripcionEstado = '';
        this.dialogoEstadoVisible = true;
    }

    cambiarEstado(): void {
        if (!this.reporteSeleccionado || !this.estadoSeleccionado) return this.advertir('Seleccione el nuevo estado.');
        this.reporte
            .cambiarEstadoReporte(this.reporteSeleccionado.id, this.estadoSeleccionado, this.descripcionEstado || null)
            .subscribe({ next: (r) => this.completado(r.mensaje, 'estado'), error: (e) => this.mostrarError(e) });
    }

    confirmar(reporte: Reporte): void {
        this.confirmacion
            .confirmarReporte(reporte.id)
            .subscribe({ next: (r) => this.completado(r.mensaje), error: (e) => this.mostrarError(e) });
    }

    abrirResolucion(reporte: Reporte): void {
        this.reporteSeleccionado = reporte;
        this.causaResolucion = '';
        this.descripcionResolucion = '';
        this.fechaRestablecimiento = this.fechaLocal(new Date().toISOString());
        this.fechaEstimadaResolucion = this.fechaLocal(new Date().toISOString());
        this.dialogoResolucionVisible = true;
    }

    registrarResolucion(): void {
        if (
            !this.reporteSeleccionado ||
            !this.causaResolucion.trim() ||
            !this.descripcionResolucion.trim() ||
            !this.fechaEstimadaResolucion ||
            !this.fechaRestablecimiento
        )
            return this.advertir('Complete todos los datos de la resolución.');
        this.resolucion
            .registrarResolucion(this.reporteSeleccionado.id, {
                causa: this.causaResolucion.trim(),
                descripcion: this.descripcionResolucion.trim(),
                fechaEstimadaResolucion: new Date(this.fechaEstimadaResolucion).toISOString(),
                fechaRestablecimiento: new Date(this.fechaRestablecimiento).toISOString()
            })
            .subscribe({ next: (r) => this.completado(r.mensaje, 'resolucion'), error: (e) => this.mostrarError(e) });
    }

    nombreZona(id: string): string {
        return this.zonas.find((zona) => zona.id === id)?.nombre ?? id;
    }

    nombreTecnico(id: string | null): string {
        return id ? (this.tecnicos.find((tecnico) => tecnico.id === id)?.nombre ?? id) : 'Sin asignar';
    }

    etiquetaEstado(estado: EstadoReporte): string {
        return this.estados.find((opcion) => opcion.value === estado)?.label ?? estado;
    }

    severidadEstado(estado: EstadoReporte): 'secondary' | 'warn' | 'info' | 'success' {
        return { NEW: 'secondary', IN_VERIFICATION: 'warn', CONFIRMED: 'info', RESOLVED: 'success' }[estado] as
            | 'secondary'
            | 'warn'
            | 'info'
            | 'success';
    }

    puedeEditar(reporte: Reporte): boolean {
        return this.esCiudadano && reporte.ciudadanoId === this.autenticacion.usuario()?.id && reporte.estado === 'NEW';
    }

    puedeConfirmar(reporte: Reporte): boolean {
        return (
            this.esCiudadano &&
            reporte.ciudadanoId !== this.autenticacion.usuario()?.id &&
            reporte.estado !== 'RESOLVED'
        );
    }

    puedeAceptar(reporte: Reporte): boolean {
        return this.esTecnico && reporte.tecnicoId === this.tecnicoActual?.id && reporte.estado === 'NEW';
    }

    puedeReasignar(reporte: Reporte): boolean {
        return this.esTecnico && reporte.tecnicoId === this.tecnicoActual?.id && reporte.estado !== 'RESOLVED';
    }

    puedeCambiarEstado(reporte: Reporte): boolean {
        return (
            this.esAdministrador ||
            (this.esTecnico && reporte.tecnicoId === this.tecnicoActual?.id && reporte.estado !== 'RESOLVED')
        );
    }

    puedeResolver(reporte: Reporte): boolean {
        return this.esTecnico && reporte.tecnicoId === this.tecnicoActual?.id && reporte.estado === 'CONFIRMED';
    }

    verHistorial(reporte: Reporte): void {
        this.reporte.historialReporte(reporte.id).subscribe({
            next: (respuesta) => {
                this.historial = respuesta.datos;
                this.dialogoHistorialVisible = true;
            },
            error: (error) => this.mostrarError(error)
        });
    }

    verDetalle(reporte: Reporte): void {
        this.detalleReporte = reporte;
        this.resolucionDetalle = null;
        this.dialogoDetalleVisible = true;
        if (reporte.estado === 'RESOLVED') {
            this.resolucion.detalleResolucion(reporte.id).subscribe({
                next: (respuesta) => (this.resolucionDetalle = respuesta.datos.resolucion),
                error: (error) => this.mostrarError(error)
            });
        }
    }

    confirmarDuplicado(): void {
        if (!this.reporteDuplicadoId) return;
        this.confirmacion.confirmarReporte(this.reporteDuplicadoId).subscribe({
            next: (respuesta) => {
                this.dialogoDuplicadoVisible = false;
                this.completado(respuesta.mensaje);
            },
            error: (error) => this.mostrarError(error)
        });
    }

    private crearReporte(fecha: string) {
        const datos = new FormData();
        datos.append('zonaId', this.formulario.zonaId ?? '');
        datos.append('direccionAproximada', this.formulario.direccionAproximada.trim());
        datos.append('fechaHoraInicio', fecha);
        if (this.formulario.evidencia) datos.append('evidencia', this.formulario.evidencia);
        return this.reporte.crearReporte(datos);
    }

    private formularioVacio(): FormularioReporte {
        return {
            zonaId: null,
            direccionAproximada: '',
            fechaHoraInicio: this.fechaLocal(new Date().toISOString()),
            evidencia: null
        };
    }

    private fechaLocal(fecha: string): string {
        const valor = new Date(fecha);
        valor.setMinutes(valor.getMinutes() - valor.getTimezoneOffset());
        return valor.toISOString().slice(0, 16);
    }

    private completado(mensaje: string, dialogo?: 'reporte' | 'asignacion' | 'estado' | 'resolucion'): void {
        this.guardando = false;
        if (dialogo === 'reporte') this.dialogoReporteVisible = false;
        if (dialogo === 'asignacion') this.dialogoAsignacionVisible = false;
        if (dialogo === 'estado') this.dialogoEstadoVisible = false;
        if (dialogo === 'resolucion') this.dialogoResolucionVisible = false;
        this.mensajes.add({ severity: 'success', summary: 'Completado', detail: mensaje });
        this.cargar();
    }

    private advertir(mensaje: string): void {
        this.mensajes.add({ severity: 'warn', summary: 'Validación', detail: mensaje });
    }

    private mostrarError(error: HttpErrorResponse): void {
        this.cargando = false;
        this.guardando = false;
        if (error.status === 409 && Array.isArray(error.error?.errores) && error.error.errores[0]) {
            this.reporteDuplicadoId = error.error.errores[0];
            this.dialogoReporteVisible = false;
            this.dialogoDuplicadoVisible = true;
            this.cargar();
        }
        this.mensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.mensaje ?? 'No fue posible completar la operación.'
        });
    }
}

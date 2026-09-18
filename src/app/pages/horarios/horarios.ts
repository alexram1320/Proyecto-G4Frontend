import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { ApagonYaApiService } from '../../core/services/apagonya-api.service';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { HorarioCorte } from '@/core/models/HorarioCorte.model';
import { Zona } from '@/core/models/zona.model';
import { ZonaService } from '@/core/services/Zona.services';
import { HorariosServices } from '@/core/services/Horarios.services';

interface FormularioHorario {
    id?: string;
    zonaId: string | null;
    titulo: string;
    descripcion: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
}

@Component({
    selector: 'app-horarios',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="m-0">Cortes programados</h2>
                    <p class="text-muted-color mt-2 mb-0">Horarios de interrupciones planificadas por zona.</p>
                </div>
                @if (esAdministrador) {
                    <p-button label="Nuevo horario" icon="pi pi-calendar-plus" (onClick)="abrirNuevo()" />
                }
            </div>

            @if (esAdministrador) {
                <div class="flex flex-wrap gap-3 mb-5">
                    <p-select [(ngModel)]="filtroZona" [options]="zonas" optionLabel="nombre" optionValue="id" placeholder="Todas las zonas" [showClear]="true" class="min-w-64" />
                    <p-button label="Aplicar filtro" icon="pi pi-filter" severity="secondary" (onClick)="cargar()" />
                </div>
            }

            <p-table [value]="horarios" [loading]="cargando" [paginator]="true" [rows]="10" responsiveLayout="scroll">
                <ng-template #header>
                    <tr><th>Zona</th><th>Actividad</th><th>Inicio</th><th>Fin</th><th>Estado</th>@if (esAdministrador) { <th>Acciones</th> }</tr>
                </ng-template>
                <ng-template #body let-horario>
                    <tr>
                        <td>{{ nombreZona(horario.zonaId) }}</td>
                        <td><span class="font-medium">{{ horario.titulo }}</span><small class="block text-muted-color mt-1">{{ horario.descripcion || 'Sin descripción' }}</small></td>
                        <td>{{ horario.fechaHoraInicio | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>{{ horario.fechaHoraFin | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td><p-tag [value]="horario.activo ? 'Publicado' : 'Inactivo'" [severity]="horario.activo ? 'info' : 'secondary'" /></td>
                        @if (esAdministrador) {
                            <td class="whitespace-nowrap">
                                <p-button icon="pi pi-pencil" rounded text aria-label="Editar horario" (onClick)="abrirEdicion(horario)" />
                                <p-button [icon]="horario.activo ? 'pi pi-eye-slash' : 'pi pi-eye'" rounded text [severity]="horario.activo ? 'danger' : 'success'" [attr.aria-label]="horario.activo ? 'Desactivar horario' : 'Activar horario'" (onClick)="cambiarEstado(horario)" />
                            </td>
                        }
                    </tr>
                </ng-template>
                <ng-template #emptymessage><tr><td [attr.colspan]="esAdministrador ? 6 : 5" class="text-center py-8">No hay cortes programados para mostrar.</td></tr></ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="dialogoVisible" [modal]="true" [style]="{ width: '40rem' }" [header]="formulario.id ? 'Editar horario' : 'Nuevo horario'">
            <div class="flex flex-col gap-5">
                <div><label class="block font-semibold mb-2">Zona</label><p-select [(ngModel)]="formulario.zonaId" [options]="zonasActivas" optionLabel="nombre" optionValue="id" placeholder="Seleccione una zona" fluid /></div>
                <div><label class="block font-semibold mb-2">Título</label><input pInputText [(ngModel)]="formulario.titulo" maxlength="120" class="w-full" /></div>
                <div><label class="block font-semibold mb-2">Descripción</label><textarea pTextarea [(ngModel)]="formulario.descripcion" maxlength="800" rows="4" class="w-full"></textarea></div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6"><label class="block font-semibold mb-2">Inicio</label><input pInputText type="datetime-local" [(ngModel)]="formulario.fechaHoraInicio" class="w-full" /></div>
                    <div class="col-span-12 md:col-span-6"><label class="block font-semibold mb-2">Fin</label><input pInputText type="datetime-local" [(ngModel)]="formulario.fechaHoraFin" class="w-full" /></div>
                </div>
            </div>
            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="dialogoVisible = false" />
                <p-button label="Guardar" icon="pi pi-check" [loading]="guardando" (onClick)="guardar()" />
            </ng-template>
        </p-dialog>
    `
})
export class HorariosPage implements OnInit {
    horarios: HorarioCorte[] = [];
    zonas: Zona[] = [];
    filtroZona: string | null = null;
    formulario: FormularioHorario = this.vacio();
    dialogoVisible = false;
    cargando = false;
    guardando = false;

    get esAdministrador(): boolean { return this.autenticacion.tieneRol('ADMIN'); }
    get zonasActivas(): Zona[] { return this.zonas.filter((zona) => zona.activa); }

    constructor(
        private readonly api: ApagonYaApiService,
        private readonly autenticacion: AutenticacionService,
        private readonly mensajes: MessageService,
        private readonly zona: ZonaService,
        private readonly horario: HorariosServices
    ) {}

    ngOnInit(): void {
        this.zona.listarZonas(this.esAdministrador).subscribe({
            next: (respuesta) => (this.zonas = respuesta.datos),
            error: (error) => this.mostrarError(error)
        });
        this.cargar();
    }

    cargar(): void {
        this.cargando = true;
        this.horario.listarHorarios(this.filtroZona, this.esAdministrador).subscribe({
            next: (respuesta) => { this.horarios = respuesta.datos; this.cargando = false; },
            error: (error) => this.mostrarError(error)
        });
    }

    abrirNuevo(): void {
        const inicio = new Date();
        inicio.setHours(inicio.getHours() + 1, 0, 0, 0);
        const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
        this.formulario = { ...this.vacio(), fechaHoraInicio: this.fechaLocal(inicio), fechaHoraFin: this.fechaLocal(fin) };
        this.dialogoVisible = true;
    }

    abrirEdicion(horario: HorarioCorte): void {
        this.formulario = {
            id: horario.id,
            zonaId: horario.zonaId,
            titulo: horario.titulo,
            descripcion: horario.descripcion,
            fechaHoraInicio: this.fechaLocal(new Date(horario.fechaHoraInicio)),
            fechaHoraFin: this.fechaLocal(new Date(horario.fechaHoraFin))
        };
        this.dialogoVisible = true;
    }

    guardar(): void {
        if (!this.formulario.zonaId || !this.formulario.titulo.trim() || !this.formulario.fechaHoraInicio || !this.formulario.fechaHoraFin) {
            return this.advertir('Complete la zona, el título, el inicio y el fin.');
        }
        const inicio = new Date(this.formulario.fechaHoraInicio);
        const fin = new Date(this.formulario.fechaHoraFin);
        if (fin <= inicio) return this.advertir('La fecha de fin debe ser posterior al inicio.');

        const solicitud = {
            zonaId: this.formulario.zonaId,
            titulo: this.formulario.titulo.trim(),
            descripcion: this.formulario.descripcion.trim(),
            fechaHoraInicio: inicio.toISOString(),
            fechaHoraFin: fin.toISOString()
        };
        this.guardando = true;
        const operacion = this.formulario.id
            ? this.horario.actualizarHorario(this.formulario.id, solicitud)
            : this.horario.crearHorario(solicitud);
        operacion.subscribe({
            next: (respuesta) => { this.guardando = false; this.dialogoVisible = false; this.exito(respuesta.mensaje); this.cargar(); },
            error: (error) => this.mostrarError(error)
        });
    }

    cambiarEstado(horario: HorarioCorte): void {
        this.horario.cambiarEstadoHorario(horario.id, !horario.activo).subscribe({
            next: (respuesta) => { this.exito(respuesta.mensaje); this.cargar(); },
            error: (error) => this.mostrarError(error)
        });
    }

    nombreZona(id: string): string { return this.zonas.find((zona) => zona.id === id)?.nombre ?? id; }
    private vacio(): FormularioHorario { return { zonaId: null, titulo: '', descripcion: '', fechaHoraInicio: '', fechaHoraFin: '' }; }
    private fechaLocal(fecha: Date): string { const valor = new Date(fecha); valor.setMinutes(valor.getMinutes() - valor.getTimezoneOffset()); return valor.toISOString().slice(0, 16); }
    private advertir(detalle: string): void { this.mensajes.add({ severity: 'warn', summary: 'Validación', detail: detalle }); }
    private exito(detalle: string): void { this.mensajes.add({ severity: 'success', summary: 'Completado', detail: detalle }); }
    private mostrarError(error: HttpErrorResponse): void { this.cargando = false; this.guardando = false; this.mensajes.add({ severity: 'error', summary: 'Error', detail: error.error?.mensaje ?? 'No fue posible completar la operación.' }); }
}
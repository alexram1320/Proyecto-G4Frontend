import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ApagonYaApiService } from '../../core/services/apagonya-api.service';

@Component({
    selector: 'app-zonas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
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
                    <h2 class="m-0">Zonas</h2>
                    <p class="text-muted-color mt-2 mb-0">Catálogo geográfico para reportes y técnicos.</p>
                </div>
                <p-button label="Nueva zona" icon="pi pi-plus" (onClick)="abrirNueva()" />
            </div>

            <p-table
                [value]="zonas"
                [loading]="cargando"
                [paginator]="true"
                [rows]="10"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th style="width: 12rem">Acciones</th>
                    </tr>
                </ng-template>
                <ng-template #body let-zona>
                    <tr>
                        <td class="font-medium">{{ zona.nombre }}</td>
                        <td>{{ zona.descripcion || 'Sin descripción' }}</td>
                        <td>
                            <p-tag
                                [value]="zona.activa ? 'Activa' : 'Inactiva'"
                                [severity]="zona.activa ? 'success' : 'secondary'"
                            />
                        </td>
                        <td>
                            <p-button icon="pi pi-pencil" rounded text (onClick)="abrirEdicion(zona)" />
                            <p-button
                                [icon]="zona.activa ? 'pi pi-ban' : 'pi pi-check'"
                                rounded
                                text
                                [severity]="zona.activa ? 'danger' : 'success'"
                                (onClick)="cambiarEstado(zona)"
                            />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4" class="text-center py-8">No hay zonas registradas.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog
            [(visible)]="dialogoVisible"
            [modal]="true"
            [style]="{ width: '32rem' }"
            [header]="zonaEditada.id ? 'Editar zona' : 'Nueva zona'"
        >
            <div class="flex flex-col gap-5">
                <div>
                    <label for="nombreZona" class="block font-semibold mb-2">Nombre</label>
                    <input
                        id="nombreZona"
                        pInputText
                        [(ngModel)]="zonaEditada.nombre"
                        class="w-full"
                        maxlength="100"
                        autofocus
                    />
                </div>
                <div>
                    <label for="descripcionZona" class="block font-semibold mb-2">Descripción</label>
                    <textarea
                        id="descripcionZona"
                        pTextarea
                        [(ngModel)]="zonaEditada.descripcion"
                        rows="4"
                        class="w-full"
                        maxlength="500"
                    ></textarea>
                </div>
            </div>
            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="dialogoVisible = false" />
                <p-button label="Guardar" icon="pi pi-check" [loading]="guardando" (onClick)="guardar()" />
            </ng-template>
        </p-dialog>
    `
})
export class ZonasPage implements OnInit {
    zonas: Zona[] = [];
    zonaEditada: Partial<Zona> = {};
    dialogoVisible = false;
    cargando = false;
    guardando = false;

    constructor(
        private readonly api: ApagonYaApiService,
        private readonly mensajes: MessageService,
        private readonly zonas: ZonaServices

    ) {}

    ngOnInit(): void {
        this.cargar();
    }

    cargar(): void {
        this.cargando = true;
        this.api.listarZonas(true).subscribe({
            next: (respuesta) => {
                this.zonas = respuesta.datos;
                this.cargando = false;
            },
            error: (error) => this.mostrarError(error)
        });
    }

    abrirNueva(): void {
        this.zonaEditada = { nombre: '', descripcion: '' };
        this.dialogoVisible = true;
    }

    abrirEdicion(zona: Zona): void {
        this.zonaEditada = { ...zona };
        this.dialogoVisible = true;
    }

    guardar(): void {
        const nombre = this.zonaEditada.nombre?.trim();
        const descripcion = this.zonaEditada.descripcion?.trim() ?? '';

        if (!nombre) {
            this.mensajes.add({ severity: 'warn', summary: 'Validación', detail: 'El nombre es obligatorio.' });
            return;
        }

        this.guardando = true;
        const operacion = this.zonaEditada.id
            ? this.api.actualizarZona(this.zonaEditada.id, nombre, descripcion)
            : this.api.crearZona(nombre, descripcion);

        operacion.subscribe({
            next: (respuesta) => {
                this.guardando = false;
                this.dialogoVisible = false;
                this.mensajes.add({ severity: 'success', summary: 'Completado', detail: respuesta.mensaje });
                this.cargar();
            },
            error: (error) => this.mostrarError(error)
        });
    }

    cambiarEstado(zona: Zona): void {
        this.api.cambiarEstadoZona(zona.id, !zona.activa).subscribe({
            next: (respuesta) => {
                this.mensajes.add({ severity: 'success', summary: 'Completado', detail: respuesta.mensaje });
                this.cargar();
            },
            error: (error) => this.mostrarError(error)
        });
    }

    private mostrarError(error: HttpErrorResponse): void {
        this.cargando = false;
        this.guardando = false;
        this.mensajes.add({
            severity: 'error',
            summary: 'No fue posible completar la operación',
            detail: error.error?.mensaje ?? 'Verifique que la API esté disponible.'
        });
    }
}

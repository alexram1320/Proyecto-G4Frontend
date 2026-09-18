import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Tecnico } from '@/core/models/tecnico.models';
import { Zona} from '@/core/models/zona.model';
import { TecnicoService } from '@/core/services/tecnico.service';
import { ZonaService} from '@/core/services/Zona.services';

@Component({
    selector: 'app-tecnicos',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        PasswordModule,
        SelectModule,
        TableModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="m-0">Técnicos</h2>
                    <p class="text-muted-color mt-2 mb-0">Personal operativo, zona, disponibilidad y carga activa.</p>
                </div>
                <p-button label="Nuevo técnico" icon="pi pi-user-plus" (onClick)="abrirNuevo()" />
            </div>

            <p-table
                [value]="tecnicos"
                [loading]="cargando"
                [paginator]="true"
                [rows]="10"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Zona</th>
                        <th>Disponibilidad</th>
                        <th>Carga</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </ng-template>
                <ng-template #body let-tecnico>
                    <tr>
                        <td class="font-medium">{{ tecnico.nombre }}</td>
                        <td>{{ tecnico.email }}</td>
                        <td>{{ nombreZona(tecnico.zonaId) }}</td>
                        <td>
                            <p-tag
                                [value]="tecnico.disponible ? 'Disponible' : 'No disponible'"
                                [severity]="tecnico.disponible ? 'success' : 'warn'"
                            />
                        </td>
                        <td>{{ tecnico.cargaReportesActivos }}</td>
                        <td>
                            <p-tag
                                [value]="tecnico.activo ? 'Activo' : 'Inactivo'"
                                [severity]="tecnico.activo ? 'info' : 'secondary'"
                            />
                        </td>
                        <td class="whitespace-nowrap">
                            <p-button icon="pi pi-pencil" rounded text (onClick)="abrirEdicion(tecnico)" />
                            <p-button
                                icon="pi pi-map-marker"
                                rounded
                                text
                                severity="secondary"
                                (onClick)="abrirZona(tecnico)"
                            />
                            <p-button
                                [icon]="tecnico.disponible ? 'pi pi-pause' : 'pi pi-play'"
                                rounded
                                text
                                severity="warn"
                                (onClick)="cambiarDisponibilidad(tecnico)"
                            />
                            <p-button
                                [icon]="tecnico.activo ? 'pi pi-ban' : 'pi pi-check'"
                                rounded
                                text
                                [severity]="tecnico.activo ? 'danger' : 'success'"
                                (onClick)="cambiarEstado(tecnico)"
                            />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog
            [(visible)]="dialogoVisible"
            [modal]="true"
            [style]="{ width: '34rem' }"
            [header]="tecnicoEditado.id ? 'Editar técnico' : 'Nuevo técnico'"
        >
            <div class="flex flex-col gap-5">
                <div>
                    <label class="block font-semibold mb-2">Nombre</label
                    ><input pInputText [(ngModel)]="tecnicoEditado.nombre" class="w-full" />
                </div>
                @if (!tecnicoEditado.id) {
                    <div>
                        <label class="block font-semibold mb-2">Correo</label
                        ><input pInputText type="email" [(ngModel)]="tecnicoEditado.email" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Contraseña inicial</label
                        ><p-password
                            [(ngModel)]="contrasena"
                            [toggleMask]="true"
                            [feedback]="true"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                        />
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Zona</label
                        ><p-select
                            [(ngModel)]="tecnicoEditado.zonaId"
                            [options]="zonasActivas"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Seleccione una zona"
                            [showClear]="true"
                            fluid
                        />
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Disponibilidad inicial</label>
                        <p-select
                            [(ngModel)]="tecnicoEditado.disponible"
                            [options]="opcionesDisponibilidad"
                            optionLabel="label"
                            optionValue="value"
                            fluid
                        />
                    </div>
                }
            </div>
            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="dialogoVisible = false" />
                <p-button label="Guardar" icon="pi pi-check" [loading]="guardando" (onClick)="guardar()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="dialogoZonaVisible" [modal]="true" [style]="{ width: '28rem' }" header="Asignar zona">
            <p-select
                [(ngModel)]="zonaSeleccionada"
                [options]="zonasActivas"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una zona"
                fluid
            />
            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="dialogoZonaVisible = false" />
                <p-button label="Asignar" icon="pi pi-map-marker" (onClick)="asignarZona()" />
            </ng-template>
        </p-dialog>
    `
})
export class TecnicosPage implements OnInit {
    readonly opcionesDisponibilidad = [
        { label: 'Disponible', value: true },
        { label: 'No disponible', value: false }
    ];
    tecnicos: Tecnico[] = [];
    zonas: Zona[] = [];
    tecnicoEditado: Partial<Tecnico> = {};
    tecnicoZona: Tecnico | null = null;
    zonaSeleccionada: string | null = null;
    contrasena = '';
    dialogoVisible = false;
    dialogoZonaVisible = false;
    cargando = false;
    guardando = false;

    get zonasActivas(): Zona[] {
        return this.zonas.filter((zona) => zona.activa);
    }

    constructor(
        private readonly tecnico: TecnicoService,
        private readonly mensajes: MessageService,
        private readonly zona: ZonaService
    ) {}

    ngOnInit(): void {
        this.zona.listarZonas(true).subscribe((respuesta) => (this.zonas = respuesta.datos));
        this.cargar();
    }

    cargar(): void {
        this.cargando = true;
        this.tecnico.listarTecnicos().subscribe({
            next: (respuesta) => {
                this.tecnicos = respuesta.datos;
                this.cargando = false;
            },
            error: (error) => this.mostrarError(error)
        });
    }

    nombreZona(zonaId: string | null): string {
        return this.zonas.find((zona) => zona.id === zonaId)?.nombre ?? 'Sin asignar';
    }

    abrirNuevo(): void {
        this.tecnicoEditado = { nombre: '', email: '', zonaId: null, disponible: true };
        this.contrasena = '';
        this.dialogoVisible = true;
    }

    abrirEdicion(tecnico: Tecnico): void {
        this.tecnicoEditado = { ...tecnico };
        this.dialogoVisible = true;
    }

    abrirZona(tecnico: Tecnico): void {
        this.tecnicoZona = tecnico;
        this.zonaSeleccionada = tecnico.zonaId;
        this.dialogoZonaVisible = true;
    }

    guardar(): void {
        const nombre = this.tecnicoEditado.nombre?.trim();
        if (!nombre) return this.advertir('El nombre es obligatorio.');
        if (
            !this.tecnicoEditado.id &&
            (!this.tecnicoEditado.email?.trim() || this.contrasena.length < 8 || !this.tecnicoEditado.zonaId)
        ) {
            return this.advertir('Ingrese correo, zona y una contraseña de al menos 8 caracteres.');
        }

        this.guardando = true;
        const operacion = this.tecnicoEditado.id
            ? this.tecnico.actualizarTecnico(this.tecnicoEditado.id, nombre)
            : this.tecnico.crearTecnico({
                  nombre,
                  email: this.tecnicoEditado.email?.trim() ?? '',
                  contrasena: this.contrasena,
                  zonaId: this.tecnicoEditado.zonaId!,
                  disponible: this.tecnicoEditado.disponible ?? true
              });

        operacion.subscribe({
            next: (respuesta) => this.completado(respuesta.mensaje, true),
            error: (error) => this.mostrarError(error)
        });
    }

    asignarZona(): void {
        if (!this.tecnicoZona || !this.zonaSeleccionada) return this.advertir('Seleccione una zona.');
        this.tecnico.asignarZonaTecnico(this.tecnicoZona.id, this.zonaSeleccionada).subscribe({
            next: (respuesta) => {
                this.dialogoZonaVisible = false;
                this.completado(respuesta.mensaje);
            },
            error: (error) => this.mostrarError(error)
        });
    }

    cambiarDisponibilidad(tecnico: Tecnico): void {
        this.tecnico
            .cambiarDisponibilidadTecnico(tecnico.id, !tecnico.disponible)
            .subscribe({ next: (r) => this.completado(r.mensaje), error: (e) => this.mostrarError(e) });
    }

    cambiarEstado(tecnico: Tecnico): void {
        this.tecnico
            .cambiarEstadoTecnico(tecnico.id, !tecnico.activo)
            .subscribe({ next: (r) => this.completado(r.mensaje), error: (e) => this.mostrarError(e) });
    }

    private completado(mensaje: string, cerrarDialogo = false): void {
        this.guardando = false;
        if (cerrarDialogo) this.dialogoVisible = false;
        this.mensajes.add({ severity: 'success', summary: 'Completado', detail: mensaje });
        this.cargar();
    }

    private advertir(mensaje: string): void {
        this.mensajes.add({ severity: 'warn', summary: 'Validación', detail: mensaje });
    }

    private mostrarError(error: HttpErrorResponse): void {
        this.cargando = false;
        this.guardando = false;
        this.mensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.mensaje ?? 'No fue posible completar la operación.'
        });
    }
}

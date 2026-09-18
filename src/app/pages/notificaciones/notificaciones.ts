import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { Notificacion } from '../../core/models/notificacion.model';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { FirebaseRealtimeService } from '../../core/services/firebase-realtime.service';

@Component({
    selector: 'app-notificaciones',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="m-0">Notificaciones</h2>
                    <p class="text-muted-color mt-2 mb-0">
                        Actualización automática de reportes y resoluciones.
                    </p>
                </div>

                <p-button
                    label="Actualizar"
                    icon="pi pi-refresh"
                    severity="secondary"
                    (onClick)="cargar()"
                />
            </div>

            <p-table
                [value]="notificaciones"
                [loading]="cargando"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th>Fecha</th>
                        <th>Prioridad</th>
                        <th>Evento</th>
                        <th>Mensaje</th>
                        <th>Estado</th>
                    </tr>
                </ng-template>

                <ng-template #body let-notificacion>
                    <tr [class.font-semibold]="!notificacion.leida">
                        <td>
                            {{ notificacion.fechaCreacion | date: 'dd/MM/yyyy HH:mm' }}
                        </td>

                        <td>
                            <p-tag
                                [value]="notificacion.prioridad"
                                [severity]="
                                    notificacion.prioridad === 'ALTA'
                                        ? 'danger'
                                        : 'secondary'
                                "
                            />
                        </td>

                        <td>{{ notificacion.titulo }}</td>

                        <td>{{ notificacion.mensaje }}</td>

                        <td>
                            @if (notificacion.leida) {
                                <span class="text-muted-color">
                                    Leída
                                </span>
                            } @else {
                                <p-button
                                    label="Marcar leída"
                                    size="small"
                                    text
                                    (onClick)="marcarLeida(notificacion)"
                                />
                            }
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center py-8">
                            No hay notificaciones.
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class NotificacionesPage implements OnInit, OnDestroy {
    notificaciones: Notificacion[] = [];
    cargando = true;

    private readonly destruir = new Subject<void>();
    private cancelarTiempoReal: (() => void) | null = null;

    constructor(
        private readonly notificacionesService: NotificacionService,
        private readonly autenticacion: AutenticacionService,
        private readonly firebase: FirebaseRealtimeService,
        private readonly mensajes: MessageService
    ) {}

    ngOnInit(): void {
        timer(0, 10_000)
            .pipe(
                switchMap(() =>
                    this.notificacionesService.listar()
                ),
                takeUntil(this.destruir)
            )
            .subscribe({
                next: (respuesta) => {
                    this.notificaciones = respuesta.datos;
                    this.cargando = false;
                },
                error: (error) =>
                    this.mostrarError(error)
            });

        const usuarioId =
            this.autenticacion.usuario()?.id;

        if (usuarioId) {
            void this.firebase
                .observarNotificaciones(
                    usuarioId,
                    () => this.cargar()
                )
                .then(
                    (cancelar) =>
                        (this.cancelarTiempoReal =
                            cancelar)
                );
        }
    }

    ngOnDestroy(): void {
        this.destruir.next();
        this.destruir.complete();
        this.cancelarTiempoReal?.();
    }

    cargar(): void {
        this.cargando = true;

        this.notificacionesService
            .listar()
            .subscribe({
                next: (respuesta) => {
                    this.notificaciones =
                        respuesta.datos;

                    this.cargando = false;
                },
                error: (error) =>
                    this.mostrarError(error)
            });
    }

    marcarLeida(
        notificacion: Notificacion
    ): void {
        this.notificacionesService
            .marcarLeida(notificacion.id)
            .subscribe({
                next: () => {
                    notificacion.leida = true;
                },
                error: (error) =>
                    this.mostrarError(error)
            });
    }

    private mostrarError(
        error: HttpErrorResponse
    ): void {
        this.cargando = false;

        this.mensajes.add({
            severity: 'error',
            summary:
                'Notificaciones no disponibles',
            detail:
                error.error?.mensaje ??
                'No fue posible consultar las notificaciones.'
        });
    }
}
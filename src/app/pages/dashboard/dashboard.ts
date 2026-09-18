import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { forkJoin } from 'rxjs';

import {
    EstadisticasPanel,
    EstadisticaTecnico,
    EstadisticaZona
} from '../../core/models/estadisticas.model';

import {
    DashboardReporte,
    DashboardTecnico,
    DashboardZona,
    EstadoReporte
} from '../../core/models/dashboard.model';

import {
    EstadisticasService
} from '../../core/services/estadisticas.service';

import {
    DashboardService
} from '../../core/services/dashboard.service';

import {
    AutenticacionService
} from '../../core/services/autenticacion.service';

import {
    FirebaseRealtimeService
} from '../../core/services/firebase-realtime.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,

    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ChartModule,
        InputTextModule,
        ProgressBarModule,
        SelectModule,
        TableModule,
        TagModule,
        ToastModule
    ],

    providers: [
        MessageService
    ],

    template: `
        <p-toast />

        <div class="mb-6">
            <h1 class="m-0">
                {{ titulo }}
            </h1>

            <p class="text-muted-color mt-2">
                {{ descripcion }}
            </p>
        </div>

        @if (esAdministrador) {
            <div class="card mb-6">
                <h3 class="mt-0">
                    Filtros de gestión
                </h3>

                <div class="grid grid-cols-12 gap-4">

                    <div class="col-span-12 md:col-span-3">
                        <input
                            pInputText
                            type="date"
                            [(ngModel)]="fechaInicial"
                            class="w-full"
                            aria-label="Fecha inicial"
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <input
                            pInputText
                            type="date"
                            [(ngModel)]="fechaFinal"
                            class="w-full"
                            aria-label="Fecha final"
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <p-select
                            [(ngModel)]="zonaId"
                            [options]="catalogoZonas"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Todas las zonas"
                            [showClear]="true"
                            fluid
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <p-select
                            [(ngModel)]="tecnicoId"
                            [options]="catalogoTecnicos"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Todos los técnicos"
                            [showClear]="true"
                            fluid
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <p-select
                            [(ngModel)]="estado"
                            [options]="estados"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Todos los estados"
                            [showClear]="true"
                            fluid
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <p-select
                            [(ngModel)]="agrupacion"
                            [options]="agrupaciones"
                            optionLabel="label"
                            optionValue="value"
                            fluid
                        />
                    </div>

                    <div class="col-span-12 md:col-span-3">
                        <p-button
                            label="Aplicar filtros"
                            icon="pi pi-filter"
                            (onClick)="cargarAdministrador()"
                        />
                    </div>

                </div>
            </div>
        }

        <div class="grid grid-cols-12 gap-6 mb-6">

            @for (
                tarjeta of tarjetas;
                track tarjeta.etiqueta
            ) {
                <div
                    class="col-span-12 sm:col-span-6 xl:col-span-3"
                >
                    <div class="card mb-0">

                        <span
                            class="block text-muted-color font-medium mb-2"
                        >
                            {{ tarjeta.etiqueta }}
                        </span>

                        <div class="font-medium text-3xl">
                            {{ tarjeta.valor }}
                        </div>

                    </div>
                </div>
            }

        </div>

        @if (esAdministrador) {

            <div class="grid grid-cols-12 gap-6">

                <div class="col-span-12 xl:col-span-6">
                    <div class="card">

                        <h3 class="mt-0">
                            Cortes reportados por zona
                        </h3>

                        <p-chart
                            type="bar"
                            [data]="graficoZonas"
                            [options]="opcionesGrafico"
                        />

                    </div>
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <div class="card">

                        <h3 class="mt-0">
                            Distribución por estado
                        </h3>

                        <p-chart
                            type="doughnut"
                            [data]="graficoEstados"
                            [options]="opcionesGrafico"
                        />

                    </div>
                </div>

                <div class="col-span-12">
                    <div class="card">

                        <h3 class="mt-0">
                            Tendencia de reportes y resoluciones
                        </h3>

                        <p-chart
                            type="line"
                            [data]="graficoTendencia"
                            [options]="opcionesGrafico"
                        />

                    </div>
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <div class="card">

                        <h3 class="mt-0">
                            Resolución por zona
                        </h3>

                        <p-table
                            [value]="zonas"
                            [loading]="cargando"
                        >

                            <ng-template #header>
                                <tr>
                                    <th>Zona</th>
                                    <th>Total</th>
                                    <th>Resueltos</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </ng-template>

                            <ng-template
                                #body
                                let-zona
                            >
                                <tr>
                                    <td>
                                        {{ zona.nombre }}
                                    </td>

                                    <td>
                                        {{ zona.total }}
                                    </td>

                                    <td>
                                        {{ zona.resueltos }}
                                    </td>

                                    <td>
                                        <p-progressbar
                                            [value]="zona.porcentajeResuelto"
                                        />
                                    </td>
                                </tr>
                            </ng-template>

                        </p-table>

                    </div>
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <div class="card">

                        <h3 class="mt-0">
                            Resolución por técnico
                        </h3>

                        <p-table
                            [value]="tecnicos"
                            [loading]="cargando"
                        >

                            <ng-template #header>
                                <tr>
                                    <th>Técnico</th>
                                    <th>Total</th>
                                    <th>Resueltos</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </ng-template>

                            <ng-template
                                #body
                                let-tecnico
                            >
                                <tr>
                                    <td>
                                        {{ tecnico.nombre }}
                                    </td>

                                    <td>
                                        {{ tecnico.total }}
                                    </td>

                                    <td>
                                        {{ tecnico.resueltos }}
                                    </td>

                                    <td>
                                        {{
                                            tecnico.porcentajeResuelto
                                                | number: '1.0-2'
                                        }}%
                                    </td>
                                </tr>
                            </ng-template>

                        </p-table>

                    </div>
                </div>

                <div class="col-span-12">
                    <div class="card">

                        <h3 class="mt-0">
                            Tiempo promedio por causa o tipo de corte
                        </h3>

                        <p-table
                            [value]="
                                panel?.tiempoPromedioPorTipoCorte ?? []
                            "
                        >

                            <ng-template #header>
                                <tr>
                                    <th>
                                        Causa o tipo registrado
                                    </th>
                                    <th>
                                        Promedio
                                    </th>
                                </tr>
                            </ng-template>

                            <ng-template
                                #body
                                let-item
                            >
                                <tr>
                                    <td>
                                        {{ item.etiqueta }}
                                    </td>

                                    <td>
                                        {{
                                            item.valor
                                                | number: '1.0-2'
                                        }}
                                        horas
                                    </td>
                                </tr>
                            </ng-template>

                        </p-table>

                    </div>
                </div>

            </div>
        }

        <div class="card">

            <h3 class="mt-0">
                {{
                    esAdministrador
                        ? 'Resultados filtrados'
                        : 'Reportes de mi zona'
                }}
            </h3>

            <p-table
                [value]="reportes"
                [loading]="cargando"
                [paginator]="true"
                [rows]="10"
                responsiveLayout="scroll"
            >

                <ng-template #header>
                    <tr>
                        <th>Zona</th>
                        <th>Dirección</th>
                        <th>Inicio</th>
                        <th>Estado</th>
                        <th>Confirmaciones</th>
                    </tr>
                </ng-template>

                <ng-template
                    #body
                    let-reporte
                >
                    <tr>
                        <td>
                            {{
                                nombreZona(
                                    reporte.zonaId
                                )
                            }}
                        </td>

                        <td>
                            {{
                                reporte.direccionAproximada
                            }}
                        </td>

                        <td>
                            {{
                                reporte.fechaHoraInicio
                                    | date:
                                        'dd/MM/yyyy HH:mm'
                            }}
                        </td>

                        <td>
                            <p-tag
                                [value]="reporte.estado"
                            />
                        </td>

                        <td>
                            {{
                                reporte.cantidadConfirmaciones
                            }}
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td
                            colspan="5"
                            class="text-center py-8"
                        >
                            No hay reportes para mostrar.
                        </td>
                    </tr>
                </ng-template>

            </p-table>

        </div>
    `
})
export class Dashboard
    implements OnInit, OnDestroy {

    panel: EstadisticasPanel | null = null;

    zonas: EstadisticaZona[] = [];

    tecnicos: EstadisticaTecnico[] = [];

    reportes: DashboardReporte[] = [];

    catalogoZonas: DashboardZona[] = [];

    catalogoTecnicos: DashboardTecnico[] = [];

    fechaInicial = '';

    fechaFinal = '';

    zonaId: string | null = null;

    tecnicoId: string | null = null;

    estado: EstadoReporte | null = null;

    agrupacion:
        'semana' | 'mes' = 'semana';

    cargando = true;

    graficoZonas: object = {};

    graficoEstados: object = {};

    graficoTendencia: object = {};

    readonly opcionesGrafico = {
        responsive: true,
        maintainAspectRatio: false
    };

    readonly estados = [
        {
            label: 'Nuevo',
            value: 'NEW'
        },
        {
            label: 'En verificación',
            value: 'IN_VERIFICATION'
        },
        {
            label: 'Confirmado',
            value: 'CONFIRMED'
        },
        {
            label: 'Resuelto',
            value: 'RESOLVED'
        }
    ];

    readonly agrupaciones = [
        {
            label: 'Por semana',
            value: 'semana'
        },
        {
            label: 'Por mes',
            value: 'mes'
        }
    ];

    private cancelarTiempoReal:
        (() => void) | null = null;

    constructor(
        private readonly estadisticas:
            EstadisticasService,

        private readonly dashboard:
            DashboardService,

        public readonly autenticacion:
            AutenticacionService,

        private readonly firebase:
            FirebaseRealtimeService,

        private readonly mensajes:
            MessageService
    ) {}

    get esAdministrador(): boolean {
        return this.autenticacion.tieneRol(
            'ADMIN'
        );
    }

    get titulo(): string {
        if (this.esAdministrador) {
            return 'Panel de administración';
        }

        if (
            this.autenticacion.tieneRol(
                'TECHNICIAN'
            )
        ) {
            return 'Panel de técnico de zona';
        }

        return 'Panel ciudadano';
    }

    get descripcion(): string {
        return this.esAdministrador
            ? 'Estado general, recurrencia y tiempos de resolución.'
            : 'Estado y seguimiento en tiempo real de los cortes de su zona.';
    }

    get tarjetas() {
        if (this.esAdministrador) {
            return [
                {
                    etiqueta:
                        'Reportes totales',
                    valor:
                        this.panel
                            ?.totalReportes ?? 0
                },
                {
                    etiqueta:
                        'Activos',
                    valor:
                        this.panel
                            ?.reportesActivos ?? 0
                },
                {
                    etiqueta:
                        'Resueltos',
                    valor:
                        this.panel
                            ?.reportesResueltos ??
                        0
                },
                {
                    etiqueta:
                        'Sin verificar',
                    valor:
                        this.panel
                            ?.sinVerificar ?? 0
                }
            ];
        }

        return [
            {
                etiqueta:
                    'Reportes de mi zona',
                valor:
                    this.reportes.length
            },
            {
                etiqueta:
                    'Activos',
                valor:
                    this.reportes.filter(
                        (r) =>
                            r.estado !==
                            'RESOLVED'
                    ).length
            },
            {
                etiqueta:
                    'Confirmados',
                valor:
                    this.reportes.filter(
                        (r) =>
                            r.estado ===
                            'CONFIRMED'
                    ).length
            },
            {
                etiqueta:
                    'Resueltos',
                valor:
                    this.reportes.filter(
                        (r) =>
                            r.estado ===
                            'RESOLVED'
                    ).length
            }
        ];
    }

    ngOnInit(): void {
        this.dashboard
            .listarZonas(true)
            .subscribe(
                (respuesta) =>
                    (this.catalogoZonas =
                        respuesta.datos)
            );

        if (this.esAdministrador) {
            this.dashboard
                .listarTecnicos()
                .subscribe(
                    (respuesta) =>
                        (this.catalogoTecnicos =
                            respuesta.datos)
                );

            this.cargarAdministrador();
        } else {
            this.cargarReportes();
        }

        const usuario =
            this.autenticacion.usuario();

        if (usuario) {
            void this.firebase
                .observarReportes(
                    usuario,
                    () => {
                        if (
                            this.esAdministrador
                        ) {
                            this.cargarAdministrador();
                        } else {
                            this.cargarReportes();
                        }
                    }
                )
                .then(
                    (cancelar) =>
                        (this.cancelarTiempoReal =
                            cancelar)
                );
        }
    }

    ngOnDestroy(): void {
        this.cancelarTiempoReal?.();
    }

    cargarAdministrador(): void {
        this.cargando = true;

        const filtros = this.filtros();

        forkJoin({
            panel:
                this.estadisticas.panel(
                    filtros
                ),

            zonas:
                this.estadisticas.zonas(
                    filtros
                ),

            tecnicos:
                this.estadisticas.tecnicos(
                    filtros
                ),

            tendencia:
                this.estadisticas.tendencias(
                    this.agrupacion,
                    filtros
                ),

            reportes:
                this.dashboard.listarReportes(
                    {
                        ...this.filtrosReportes(),
                        tamanoPagina: 100
                    }
                )
        }).subscribe({
            next: (resultado) => {
                this.panel =
                    resultado.panel.datos;

                this.zonas =
                    resultado.zonas.datos;

                this.tecnicos =
                    resultado.tecnicos.datos;

                this.reportes =
                    resultado.reportes.datos;

                this.graficoZonas = {
                    labels:
                        this.panel.porZona.map(
                            (x) =>
                                this.nombreZona(
                                    x.etiqueta
                                )
                        ),

                    datasets: [
                        {
                            label: 'Cortes',
                            data:
                                this.panel.porZona.map(
                                    (x) =>
                                        x.valor
                                ),

                            backgroundColor:
                                '#f59e0b'
                        }
                    ]
                };

                this.graficoEstados = {
                    labels:
                        this.panel.porEstado.map(
                            (x) =>
                                x.etiqueta
                        ),

                    datasets: [
                        {
                            data:
                                this.panel.porEstado.map(
                                    (x) =>
                                        x.valor
                                ),

                            backgroundColor: [
                                '#94a3b8',
                                '#f59e0b',
                                '#3b82f6',
                                '#22c55e'
                            ]
                        }
                    ]
                };

                this.graficoTendencia = {
                    labels:
                        resultado.tendencia
                            .datos.etiquetas,

                    datasets: [
                        {
                            label:
                                'Reportes',

                            data:
                                resultado.tendencia
                                    .datos.reportes,

                            borderColor:
                                '#f59e0b'
                        },
                        {
                            label:
                                'Resoluciones',

                            data:
                                resultado.tendencia
                                    .datos.resoluciones,

                            borderColor:
                                '#22c55e'
                        }
                    ]
                };

                this.cargando = false;
            },

            error: (error) =>
                this.mostrarError(error)
        });
    }

    cargarReportes(): void {
        this.cargando = true;

        this.dashboard
            .listarReportes({
                tamanoPagina: 100
            })
            .subscribe({
                next: (respuesta) => {
                    this.reportes =
                        respuesta.datos;

                    this.cargando = false;
                },

                error: (error) =>
                    this.mostrarError(error)
            });
    }

    nombreZona(
        id: string
    ): string {
        return (
            this.catalogoZonas.find(
                (zona) =>
                    zona.id === id
            )?.nombre ?? id
        );
    }

    private filtros():
        Record<string, string> {

        const filtros:
            Record<string, string> = {};

        if (this.fechaInicial) {
            filtros['fechaInicial'] =
                new Date(
                    `${this.fechaInicial}T00:00:00`
                ).toISOString();
        }

        if (this.fechaFinal) {
            filtros['fechaFinal'] =
                new Date(
                    `${this.fechaFinal}T23:59:59`
                ).toISOString();
        }

        if (this.zonaId) {
            filtros['zonaId'] =
                this.zonaId;
        }

        if (this.tecnicoId) {
            filtros['tecnicoId'] =
                this.tecnicoId;
        }

        if (this.estado) {
            filtros['estado'] =
                this.estado;
        }

        return filtros;
    }

    private filtrosReportes(): {
        fechaInicial: string | null;
        fechaFinal: string | null;
        zonaId: string | null;
        tecnicoId: string | null;
        estado: EstadoReporte | null;
    } {
        const filtros =
            this.filtros();

        return {
            fechaInicial:
                filtros['fechaInicial'] ??
                null,

            fechaFinal:
                filtros['fechaFinal'] ??
                null,

            zonaId:
                filtros['zonaId'] ??
                null,

            tecnicoId:
                filtros['tecnicoId'] ??
                null,

            estado:
                (filtros[
                    'estado'
                ] as EstadoReporte) ??
                null
        };
    }

    private mostrarError(
        error: HttpErrorResponse
    ): void {
        this.cargando = false;

        this.mensajes.add({
            severity: 'error',
            summary:
                'Panel no disponible',
            detail:
                error.error?.mensaje ??
                'No fue posible cargar los datos.'
        });
    }
}
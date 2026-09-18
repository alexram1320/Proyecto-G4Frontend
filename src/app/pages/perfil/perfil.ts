import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { Usuario } from '../../core/models/api.models';
import { ApagonYaApiService } from '../../core/services/apagonya-api.service';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { ZonaService } from '@/core/services/Zona.services';
import { Zona } from '@/core/models/zona.model';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card max-w-4xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center bg-primary-100 text-primary rounded-full" style="width: 4rem; height: 4rem">
                        <i class="pi pi-user text-3xl"></i>
                    </div>
                    <div>
                        <h2 class="m-0">Mi perfil</h2>
                        <p class="text-muted-color mt-2 mb-0">Identidad y permisos de la sesión actual.</p>
                    </div>
                </div>
                <p-button label="Cerrar sesión" icon="pi pi-sign-out" severity="danger" [outlined]="true" (onClick)="autenticacion.cerrarSesion()" />
            </div>

            @if (usuario) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Usuario</span><strong class="text-xl">{{ usuario.nombre }}</strong></div>
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Rol activo</span><p-tag [value]="etiquetaRol(usuario.rol)" severity="info" /></div>
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Correo electrónico</span><span>{{ usuario.email }}</span></div>
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Zona asignada</span><span>{{ nombreZona }}</span></div>
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Estado de la cuenta</span><p-tag [value]="usuario.activo ? 'Activa' : 'Inactiva'" [severity]="usuario.activo ? 'success' : 'danger'" /></div>
                    <div class="col-span-12 md:col-span-6"><span class="block text-muted-color text-sm mb-1">Permisos principales</span><span>{{ descripcionRol(usuario.rol) }}</span></div>
                </div>
            } @else {
                <div class="text-center py-8 text-muted-color">Cargando información del usuario...</div>
            }
        </div>
    `
})
export class PerfilPage implements OnInit {
    usuario: Usuario | null = null;
    zonas: Zona[] = [];

    get nombreZona(): string {
        if (!this.usuario?.zonaId) return 'Cobertura general';
        return this.zonas.find((zona) => zona.id === this.usuario?.zonaId)?.nombre ?? this.usuario.zonaId;
    }

    constructor(
        public readonly autenticacion: AutenticacionService,
        private readonly api: ApagonYaApiService,
        private readonly mensajes: MessageService,
         private readonly zona: ZonaService
    ) {}

    ngOnInit(): void {
        forkJoin({
            perfil: this.autenticacion.perfil(),
            zonas: this.zona.listarZonas(false)
        }).subscribe({
            next: (respuesta) => {
                this.usuario = respuesta.perfil.datos;
                this.zonas = respuesta.zonas.datos;
            },
            error: (error: HttpErrorResponse) => this.mensajes.add({
                severity: 'error',
                summary: 'Perfil no disponible',
                detail: error.error?.mensaje ?? 'No se pudo cargar la información de la sesión.'
            })
        });
    }

    etiquetaRol(rol: string): string {
        return { ADMIN: 'Administrador', TECHNICIAN: 'Técnico de zona', CITIZEN: 'Ciudadano' }[rol] ?? rol;
    }

    descripcionRol(rol: string): string {
        return {
            ADMIN: 'Administración general, técnicos, zonas, horarios y estadísticas.',
            TECHNICIAN: 'Atención, verificación y resolución de reportes asignados.',
            CITIZEN: 'Creación y confirmación de reportes de su zona.'
        }[rol] ?? 'Permisos definidos por el sistema.';
    }
}

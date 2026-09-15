import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ApagonYaApiService } from '../../core/services/apagonya-api.service';
import { AutenticacionService } from '../../core/services/autenticacion.service';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [FormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, SelectModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen p-6">
            <div class="card w-full max-w-xl p-8">
                <div class="text-center mb-8">
                    <i class="pi pi-bolt text-primary text-4xl"></i>
                    <h1 class="mb-2">Crear cuenta ciudadana</h1>
                    <p class="text-muted-color">Registra y confirma cortes en tu zona.</p>
                </div>
                <form (ngSubmit)="registrar()" class="flex flex-col gap-5">
                    <div>
                        <label for="nombre" class="block font-medium mb-2">Nombre completo</label>
                        <input id="nombre" pInputText [(ngModel)]="nombre" name="nombre" class="w-full" />
                    </div>
                    <div>
                        <label for="email" class="block font-medium mb-2">Correo</label>
                        <input id="email" pInputText type="email" [(ngModel)]="email" name="email" class="w-full" />
                    </div>
                    <div>
                        <label for="zona" class="block font-medium mb-2">Zona</label>
                        <p-select appendTo="body"
                            inputId="zona"
                            [(ngModel)]="zonaId"
                            name="zonaId"
                            [options]="zonas"
                            [loading]="cargandoZonas"
                            [disabled]="cargandoZonas || zonas.length === 0"
                            optionLabel="nombre"
                            optionValue="id"
                            placeholder="Seleccione su zona"
                            emptyMessage="No hay zonas activas disponibles"
                            fluid
                        />
                        @if (!cargandoZonas && zonas.length === 0) {
                            <div class="mt-2 text-sm text-orange-600">
                                {{ errorZonas || 'No hay zonas activas. Un administrador debe registrar una zona antes de crear cuentas ciudadanas.' }}
                            </div>
                            <p-button
                                type="button"
                                label="Recargar zonas"
                                icon="pi pi-refresh"
                                severity="secondary"
                                [text]="true"
                                (onClick)="cargarZonas()"
                            />
                        }
                    </div>
                    <div>
                        <label for="contrasena" class="block font-medium mb-2">Contraseña</label>
                        <p-password
                            inputId="contrasena"
                            [(ngModel)]="contrasena"
                            name="contrasena"
                            [toggleMask]="true"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                        />
                    </div>
                    <p-button
                        type="submit"
                        label="Crear cuenta"
                        icon="pi pi-user-plus"
                        styleClass="w-full"
                        [loading]="cargando"
                        [disabled]="cargandoZonas || zonas.length === 0"
                    />
                    <a routerLink="/auth/login" class="text-center text-primary no-underline">Volver al inicio de sesión</a>
                </form>
            </div>
        </div>
    `
})
export class RegistroPage implements OnInit {
    zonas: undefined;
    nombre = '';
    email = '';
    contrasena = '';
    zonaId: string | null = null;
    cargando = false;
    cargandoZonas = true;
    errorZonas = '';

    constructor(
        private readonly api: ApagonYaApiService,
        private readonly autenticacion: AutenticacionService,
        private readonly router: Router,
        private readonly mensajes: MessageService
    ) {}

    ngOnInit(): void {
        this.cargarZonas();
    }

    cargarZonas(): void {
        this.cargandoZonas = true;
        this.errorZonas = '';
        
    }

    registrar(): void {
        this.mensajes.clear();
        const faltantes: string[] = [];
        if (!this.nombre.trim()) faltantes.push('nombre completo');
        if (!this.email.trim()) faltantes.push('correo');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) faltantes.push('correo válido');
        if (!this.zonaId) faltantes.push('zona');
        if (this.contrasena.length < 8) faltantes.push('contraseña de al menos 8 caracteres');

        if (faltantes.length > 0) {
            this.mensajes.add({
                severity: 'warn',
                summary: 'Validación',
                detail: `Revise: ${faltantes.join(', ')}.`
            });
            return;
        }

        this.cargando = true;
        this.autenticacion
            .registrar({
                nombre: this.nombre.trim(),
                email: this.email.trim(),
                contrasena: this.contrasena,
                zonaId: this.zonaId
            })
            .subscribe({
                next: () => {
                    this.mensajes.add({
                        severity: 'success',
                        summary: 'Cuenta creada',
                        detail: 'Ahora puede iniciar sesión.'
                    });
                    setTimeout(() => void this.router.navigate(['/auth/login']), 700);
                },
                error: (error: HttpErrorResponse) => {
                    this.cargando = false;
                    const errores = Array.isArray(error.error?.errores) ? error.error.errores.join(' ') : '';
                    this.mensajes.add({
                        severity: 'error',
                        summary: 'No fue posible registrar la cuenta',
                        detail: errores || error.error?.mensaje || 'Revise la información e inténtelo nuevamente.'
                    });
                }
            });
    }
}

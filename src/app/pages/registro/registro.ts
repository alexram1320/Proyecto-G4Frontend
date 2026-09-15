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

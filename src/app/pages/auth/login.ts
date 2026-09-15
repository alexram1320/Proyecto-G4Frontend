import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { AutenticacionService } from '../../core/services/autenticacion.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen p-6">
            <div class="w-full max-w-md rounded-[2rem] p-1 bg-gradient-to-b from-primary-500 to-transparent">
                <div class="bg-surface-0 dark:bg-surface-900 py-12 px-8 rounded-[1.9rem]">
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4"
                            style="width:4rem;height:4rem"
                        >
                            <i class="pi pi-bolt text-3xl"></i>
                        </div>
                        <div class="text-3xl font-medium mb-2">ApagónYa</div>
                        <span class="text-muted-color">Accede al panel comunitario</span>
                    </div>
                    <form (ngSubmit)="ingresar()" class="flex flex-col gap-5">
                        <div>
                            <label class="block font-medium mb-2">Correo electrónico</label
                            ><input pInputText type="email" [(ngModel)]="email" name="email" class="w-full" required />
                        </div>
                        <div>
                            <label class="block font-medium mb-2">Contraseña</label
                            ><p-password
                                [(ngModel)]="contrasena"
                                name="contrasena"
                                [feedback]="false"
                                [toggleMask]="true"
                                styleClass="w-full"
                                inputStyleClass="w-full"
                            />
                        </div>
                        <p-button
                            type="submit"
                            label="Iniciar sesión"
                            icon="pi pi-sign-in"
                            styleClass="w-full"
                            [loading]="cargando"
                        />
                        <a routerLink="/registro" class="text-center text-primary no-underline"
                            >Crear una cuenta ciudadana</a
                        >
                        <button type="button" class="border-0 bg-transparent text-primary cursor-pointer" (click)="recuperacionVisible = true">¿Olvidó su contraseña?</button>
                    </form>
                </div>
            </div>
        </div>
        <p-dialog [(visible)]="recuperacionVisible" [modal]="true" header="Recuperar contraseña" [style]="{ width: '30rem' }">
            <label class="block font-medium mb-2">Correo electrónico</label>
            <input pInputText type="email" [(ngModel)]="emailRecuperacion" class="w-full" />
            <ng-template #footer><p-button label="Enviar instrucciones" icon="pi pi-envelope" (onClick)="recuperar()" /></ng-template>
        </p-dialog>
    `
})
export class Login {
    email = '';
    contrasena = '';
    cargando = false;
    recuperacionVisible = false;
    emailRecuperacion = '';

    constructor(
        private readonly autenticacion: AutenticacionService,
        private readonly router: Router,
        private readonly mensajes: MessageService
    ) {}

    ingresar(): void {
        if (!this.email.trim() || !this.contrasena) {
            this.mensajes.add({ severity: 'warn', summary: 'Validación', detail: 'Ingrese correo y contraseña.' });
            return;
        }
        this.cargando = true;
        this.autenticacion.iniciarSesion(this.email.trim(), this.contrasena).subscribe({
            next: () => void this.router.navigate(['/panel']),
            error: (error: HttpErrorResponse) => {
                this.cargando = false;
                this.mensajes.add({
                    severity: 'error',
                    summary: 'No fue posible iniciar sesión',
                    detail: error.error?.mensaje ?? 'Revise sus credenciales.'
                });
            }
        });
    }

    recuperar(): void {
        if (!this.emailRecuperacion.trim()) return;
        this.autenticacion.recuperarContrasena(this.emailRecuperacion.trim()).subscribe({
            next: (respuesta) => {
                this.recuperacionVisible = false;
                this.mensajes.add({ severity: 'success', summary: 'Solicitud procesada', detail: respuesta.mensaje });
            },
            error: (error: HttpErrorResponse) => this.mensajes.add({ severity: 'error', summary: 'No fue posible procesar la solicitud', detail: error.error?.mensaje ?? 'Intente nuevamente.' })
        });
    }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AutenticacionService } from '../../core/services/autenticacion.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu {
    readonly model: MenuItem[];

    constructor(private readonly autenticacion: AutenticacionService) {
        const modelo: MenuItem[] = [{
            label: 'Operación',
            items: [
                { label: 'Panel', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/panel'] },
                { label: 'Mi perfil', icon: 'pi pi-fw pi-user', routerLink: ['/perfil'] },
                { label: 'Reportes', icon: 'pi pi-fw pi-bolt', routerLink: ['/reportes'] },
                { label: 'Cortes programados', icon: 'pi pi-fw pi-calendar', routerLink: ['/horarios'] },
                { label: 'Notificaciones', icon: 'pi pi-fw pi-bell', routerLink: ['/notificaciones'] }
            ]
        }];

        if (this.autenticacion.tieneRol('ADMIN')) {
            modelo.push({
                label: 'Administración',
                items: [
                    { label: 'Zonas', icon: 'pi pi-fw pi-map-marker', routerLink: ['/zonas'] },
                    { label: 'Técnicos', icon: 'pi pi-fw pi-wrench', routerLink: ['/tecnicos'] }
                ]
            });
        }

        this.model = modelo;
    }
}

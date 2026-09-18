import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Login } from './app/pages/auth/login';
import { RegistroPage } from './app/pages/registro/registro';
import { ReportesPage } from './app/pages/reportes/reportes';
import { TecnicosPage } from './app/pages/tecnicos/tecnicos';
import { Landing } from './app/pages/landing/landing';
import { NotificacionesPage } from './app/pages/notificaciones/notificaciones';
import { autenticacionGuard, rolGuard } from './app/core/guards/autorizacion.guard';

export const appRoutes: Routes = [
    { path: '', component: Landing, pathMatch: 'full', title: 'ApagónYa' },
    {
        path: '',
        component: AppLayout,
        canActivate: [autenticacionGuard],
        children: [
            { path: 'panel', component: Dashboard, title: 'Panel | ApagónYa' },
            { path: 'tecnicos', component: TecnicosPage, canActivate: [rolGuard], data: { roles: ['ADMIN'] }, title: 'Técnicos | ApagónYa' },
            { path: 'reportes', component: ReportesPage, title: 'Reportes | ApagónYa' },
            { path: 'notificaciones', component: NotificacionesPage, title: 'Notificaciones | ApagónYa' }
        ]
    },
    { path: 'auth/login', component: Login, title: 'Iniciar sesión | ApagónYa' },
    { path: 'registro', component: RegistroPage, title: 'Crear cuenta | ApagónYa' },
    { path: '**', redirectTo: '' }
];

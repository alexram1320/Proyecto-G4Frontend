import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from './app/pages/auth/login';
import { RegistroPage } from './app/pages/registro/registro';

import { Landing } from './app/pages/landing/landing';
import { autenticacionGuard, rolGuard } from './app/core/guards/autorizacion.guard';

export const appRoutes: Routes = [
    { path: '', component: Landing, pathMatch: 'full', title: 'ApagónYa' },
    {
        path: '',
        component: AppLayout,
        canActivate: [autenticacionGuard],
        children: [
            
        ]
    },
    { path: 'auth/login', component: Login, title: 'Iniciar sesión | ApagónYa' },
    { path: 'registro', component: RegistroPage, title: 'Crear cuenta | ApagónYa' },
    { path: '**', redirectTo: '' }
];

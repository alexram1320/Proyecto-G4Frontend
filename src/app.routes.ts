import { Routes } from '@angular/router';

import { AppLayout } from './app/layout/component/app.layout';

import { Login } from './app/pages/auth/login';

import {
    RegistroPage
} from './app/pages/registro/registro';

import {
    Landing
} from './app/pages/landing/landing';

import {
    Dashboard
} from './app/pages/dashboard/dashboard';

import {
    NotificacionesPage
} from './app/pages/notificaciones/notificaciones';

import {
    autenticacionGuard
} from './app/core/guards/autorizacion.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
        pathMatch: 'full',
        title: 'ApagónYa'
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [
            autenticacionGuard
        ],
        children: [
            {
                path: 'panel',
                component: Dashboard,
                title:
                    'Panel | ApagónYa'
            },
            {
                path: 'notificaciones',
                component:
                    NotificacionesPage,
                title:
                    'Notificaciones | ApagónYa'
            }
        ]
    },
    {
        path: 'auth/login',
        component: Login,
        title:
            'Iniciar sesión | ApagónYa'
    },
    {
        path: 'registro',
        component:
            RegistroPage,
        title:
            'Crear cuenta | ApagónYa'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
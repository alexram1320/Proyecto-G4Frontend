import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <main class="min-h-screen bg-surface-0 dark:bg-surface-950">
            <nav class="flex items-center justify-between px-6 lg:px-20 py-5 border-b border-surface-200 dark:border-surface-800">
                <a routerLink="/" class="flex items-center gap-3 no-underline text-color"><i class="pi pi-bolt text-primary text-3xl"></i><span class="text-2xl font-bold">ApagónYa</span></a>
                <div class="flex gap-3"><p-button label="Iniciar sesión" routerLink="/auth/login" text /><p-button label="Crear cuenta" routerLink="/registro" /></div>
            </nav>

            <section class="px-6 lg:px-20 py-20 lg:py-28 text-center bg-gradient-to-b from-primary-50 to-surface-0 dark:from-surface-900 dark:to-surface-950">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium mb-6"><i class="pi pi-map-marker"></i> Información comunitaria para Honduras</div>
                <h1 class="text-5xl lg:text-7xl font-bold m-0 max-w-5xl mx-auto leading-tight">Reporta el corte, avisa a tu zona, exige respuestas</h1>
                <p class="text-xl lg:text-2xl text-muted-color max-w-3xl mx-auto mt-6 leading-relaxed">Registra y confirma cortes de energía, sigue su verificación y conoce cuándo se restablece el servicio.</p>
                <div class="flex flex-wrap justify-center gap-4 mt-8"><p-button label="Reportar un corte" icon="pi pi-bolt" size="large" routerLink="/registro" /><p-button label="Entrar al sistema" icon="pi pi-sign-in" size="large" severity="secondary" routerLink="/auth/login" /></div>
            </section>

            <section class="px-6 lg:px-20 py-16">
                <h2 class="text-4xl text-center mb-12">Una plataforma para toda la comunidad</h2>
                <div class="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
                    <article class="card col-span-12 lg:col-span-4"><i class="pi pi-users text-primary text-3xl"></i><h3>Ciudadanía</h3><p class="text-muted-color leading-relaxed">Reporta cortes con evidencia fotográfica, confirma “a mí también” y consulta el historial de su zona.</p></article>
                    <article class="card col-span-12 lg:col-span-4"><i class="pi pi-wrench text-primary text-3xl"></i><h3>Técnicos de zona</h3><p class="text-muted-color leading-relaxed">Aceptan reportes asignados, verifican el corte y registran una resolución inmutable.</p></article>
                    <article class="card col-span-12 lg:col-span-4"><i class="pi pi-chart-bar text-primary text-3xl"></i><h3>Administración</h3><p class="text-muted-color leading-relaxed">Supervisa recurrencia, estados, carga técnica y tiempos de resolución mediante reportes visuales.</p></article>
                </div>
            </section>

            <section class="px-6 lg:px-20 py-16 bg-surface-50 dark:bg-surface-900">
                <h2 class="text-4xl text-center mb-12">Del reporte a la resolución</h2>
                <div class="grid grid-cols-12 gap-6 max-w-6xl mx-auto text-center">
                    <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">1</div><h3>Nuevo</h3><p class="text-muted-color">Un ciudadano registra el corte.</p></div>
                    <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">2</div><h3>En verificación</h3><p class="text-muted-color">El técnico asignado acepta y revisa.</p></div>
                    <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">3</div><h3>Confirmado</h3><p class="text-muted-color">La comunidad valida la afectación.</p></div>
                    <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">4</div><h3>Resuelto</h3><p class="text-muted-color">Se registra la hora de restablecimiento.</p></div>
                </div>
            </section>

            <footer class="px-6 lg:px-20 py-8 flex flex-wrap justify-between gap-4"><span class="font-semibold">ApagónYa</span><span class="text-muted-color">Seguimiento comunitario de cortes de energía.</span></footer>
        </main>
    `
})
export class Landing {}

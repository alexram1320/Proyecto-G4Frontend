import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <main class="min-h-screen bg-surface-0 dark:bg-surface-950 text-color">

            <!-- ===================================================== -->
            <!-- NAVBAR -->
            <!-- ===================================================== -->
            <nav
                class="sticky top-0 z-50 bg-surface-0/95 dark:bg-surface-950/95
                       backdrop-blur border-b border-surface-200 dark:border-surface-800"
            >
                <div
                    class="max-w-7xl mx-auto px-6 lg:px-8 py-4
                           flex items-center justify-between"
                >
                    <!-- Logo -->
                    <a
                        routerLink="/"
                        class="flex items-center gap-3 no-underline text-color"
                    >
                        <div
                            class="w-11 h-11 rounded-xl bg-primary
                                   flex items-center justify-center shadow-md"
                        >
                            <i class="pi pi-bolt text-white text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-xl font-bold leading-none">
                                ApagónYa
                            </span>

                            <span class="text-xs text-muted-color mt-1">
                                Honduras
                            </span>
                        </div>
                    </a>

                    <!-- Navegación central -->
                    <div class="hidden lg:flex items-center gap-8">
                        <a
                            href="#como-funciona"
                            class="text-color no-underline font-medium hover:text-primary transition-colors"
                        >
                            Cómo funciona
                        </a>

                        <a
                            href="#comunidad"
                            class="text-color no-underline font-medium hover:text-primary transition-colors"
                        >
                            Comunidad
                        </a>

                        <a
                            href="#roles"
                            class="text-color no-underline font-medium hover:text-primary transition-colors"
                        >
                            Para quién es
                        </a>
                    </div>

                    <!-- Acciones -->
                    <div class="flex gap-2 lg:gap-3">
                        <p-button
                            label="Iniciar sesión"
                            routerLink="/auth/login"
                            text
                        />

                        <p-button
                            label="Crear cuenta"
                            routerLink="/registro"
                            class="hidden sm:block"
                        />
                    </div>
                </div>
            </nav>


            <!-- ===================================================== -->
            <!-- HERO -->
            <!-- ===================================================== -->
            <section
                class="relative overflow-hidden
                       bg-gradient-to-br
                       from-primary-50
                       via-surface-0
                       to-surface-100
                       dark:from-surface-900
                       dark:via-surface-950
                       dark:to-surface-900"
            >
                <!-- Decoraciones -->
                <div
                    class="absolute -top-32 -right-32
                           w-96 h-96 rounded-full
                           bg-primary-100 opacity-40 blur-3xl"
                ></div>

                <div
                    class="absolute -bottom-32 -left-32
                           w-96 h-96 rounded-full
                           bg-primary-100 opacity-30 blur-3xl"
                ></div>

                <div
                    class="relative max-w-7xl mx-auto
                           px-6 lg:px-8
                           py-20 lg:py-28"
                >
                    <div
                        class="grid grid-cols-12 gap-12
                               items-center"
                    >

                        <!-- TEXTO HERO -->
                        <div class="col-span-12 lg:col-span-7">

                            <div
                                class="inline-flex items-center gap-2
                                       px-4 py-2 rounded-full
                                       bg-primary-100
                                       text-primary-700
                                       dark:bg-primary-900
                                       dark:text-primary-200
                                       font-semibold text-sm mb-6"
                            >
                                <i class="pi pi-map-marker"></i>
                                Seguimiento comunitario de energía en Honduras
                            </div>

                            <h1
                                class="text-5xl md:text-6xl lg:text-7xl
                                       font-bold
                                       m-0
                                       leading-tight
                                       tracking-tight"
                            >
                                Cuando se va la luz,
                                <span class="text-primary">
                                    que todos lo sepan.
                                </span>
                            </h1>

                            <p
                                class="text-xl text-muted-color
                                       max-w-2xl
                                       mt-7 mb-0
                                       leading-relaxed"
                            >
                                Reporta cortes de energía en tu zona,
                                confirma los reportes de tus vecinos y
                                sigue cada incidencia hasta que el servicio
                                sea restablecido.
                            </p>

                            <div
                                class="flex flex-wrap gap-4 mt-8"
                            >
                                <p-button
                                    label="Crear Cuenta"
                                    icon="pi pi-bolt"
                                    size="large"
                                    routerLink="/registro"
                                />

                                <p-button
                                    label="Ya tengo una cuenta"
                                    icon="pi pi-sign-in"
                                    size="large"
                                    severity="secondary"
                                    outlined
                                    routerLink="/auth/login"
                                />
                            </div>

                            <!-- Beneficios rápidos -->
                            <div
                                class="flex flex-wrap gap-x-8 gap-y-4 mt-10
                                       text-sm text-muted-color"
                            >
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-check-circle text-green-500"></i>
                                    Reportes comunitarios
                                </div>

                                <div class="flex items-center gap-2">
                                    <i class="pi pi-check-circle text-green-500"></i>
                                    Seguimiento del estado
                                </div>

                                <div class="flex items-center gap-2">
                                    <i class="pi pi-check-circle text-green-500"></i>
                                    Historial por zona
                                </div>
                            </div>
                        </div>


                        <!-- PREVIEW DEL SISTEMA -->
                        <div class="col-span-12 lg:col-span-5">

                            <div
                                class="relative bg-surface-0
                                       dark:bg-surface-900
                                       border border-surface-200
                                       dark:border-surface-700
                                       rounded-3xl
                                       shadow-2xl
                                       p-6"
                            >

                                <!-- Encabezado -->
                                <div
                                    class="flex justify-between items-center
                                           pb-5 mb-5
                                           border-b border-surface-200
                                           dark:border-surface-700"
                                >
                                    <div>
                                        <div class="font-semibold text-lg">
                                            Reporte de zona
                                        </div>

                                        <div
                                            class="text-sm text-muted-color mt-1"
                                        >
                                            Seguimiento comunitario
                                        </div>
                                    </div>

                                    <div
                                        class="w-11 h-11 rounded-xl
                                               bg-primary-50
                                               dark:bg-primary-900
                                               flex items-center justify-center"
                                    >
                                        <i
                                            class="pi pi-bolt
                                                   text-primary text-xl"
                                        ></i>
                                    </div>
                                </div>


                                <!-- Estado -->
                                <!--<div<div
                                    class="rounded-2xl
                                           bg-orange-50
                                           dark:bg-orange-950
                                           border border-orange-200
                                           dark:border-orange-800
                                           p-5"
                                >
                                     
                                        class="flex items-center
                                               justify-between gap-3"
                                    >
                                        <div>
                                            <div
                                                class="text-xs uppercase
                                                       tracking-wider
                                                       text-orange-600
                                                       font-bold"
                                            >
                                                Corte reportado
                                            </div> 

                                            <div
                                                class="font-semibold
                                                       text-lg mt-1"
                                            >
                                                Zona Norte
                                            </div>
                                        </div>

                                        <span
                                            class="px-3 py-1
                                                   rounded-full
                                                   bg-orange-100
                                                   text-orange-700
                                                   text-xs font-bold"
                                        >
                                            EN VERIFICACIÓN
                                        </span>
                                     </div>

                                     <div
                                        class="grid grid-cols-2 gap-4 mt-5"
                                     >
                                        <div>
                                            <div
                                                class="text-xs
                                                       text-muted-color"
                                            >
                                                Reportado
                                            </div>

                                            <div class="font-semibold mt-1">
                                                Hace 18 min
                                            </div>
                                        </div>

                                        <div>
                                            <div
                                                class="text-xs
                                                       text-muted-color"
                                            >
                                                Confirmaciones
                                            </div>

                                            <div
                                                class="font-semibold
                                                       mt-1 text-primary"
                                            >
                                                7 vecinos
                                            </div>
                                        </div>
                                    </div>
                                </div>-->


                                <!-- Timeline -->
                                <div class="mt-6">

                                    <div
                                        class="flex items-start gap-4 mb-5"
                                    >
                                        <div
                                            class="w-9 h-9 rounded-full
                                                   bg-green-100
                                                   text-green-600
                                                   flex items-center
                                                   justify-center
                                                   flex-shrink-0"
                                        >
                                            <i class="pi pi-check"></i>
                                        </div>

                                        <div>
                                            <div class="font-semibold">
                                                Reporte recibido
                                            </div>

                                            <div
                                                class="text-sm
                                                       text-muted-color mt-1"
                                            >
                                                La incidencia fue registrada.
                                            </div>
                                        </div>
                                    </div>


                                    <div
                                        class="flex items-start gap-4 mb-5"
                                    >
                                        <div
                                            class="w-9 h-9 rounded-full
                                                   bg-primary-100
                                                   text-primary
                                                   flex items-center
                                                   justify-center
                                                   flex-shrink-0"
                                        >
                                            <i class="pi pi-search"></i>
                                        </div>

                                        <div>
                                            <div class="font-semibold">
                                                En verificación
                                            </div>

                                            <div
                                                class="text-sm
                                                       text-muted-color mt-1"
                                            >
                                                El reporte está siendo revisado.
                                            </div>
                                        </div>
                                    </div>


                                    <div
                                        class="flex items-start gap-4"
                                    >
                                        <div
                                            class="w-9 h-9 rounded-full
                                                   bg-surface-100
                                                   dark:bg-surface-800
                                                   text-muted-color
                                                   flex items-center
                                                   justify-center
                                                   flex-shrink-0"
                                        >
                                            <i class="pi pi-check-circle"></i>
                                        </div>

                                        <div>
                                            <div class="font-semibold">
                                                Resolución
                                            </div>

                                            <div
                                                class="text-sm
                                                       text-muted-color mt-1"
                                            >
                                                Pendiente de restablecimiento.
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <!-- Confirmación -->
                                <div
                                    class="mt-6 pt-5
                                           border-t border-surface-200
                                           dark:border-surface-700"
                                >
                                    <button
                                        type="button"
                                        class="w-full border-none cursor-pointer
                                               bg-primary
                                               text-white
                                               font-semibold
                                               rounded-xl
                                               py-3 px-4"
                                    >
                                        <i class="pi pi-thumbs-up mr-2"></i>
                                        A mí también me afecta
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <!-- ===================================================== -->
            <!-- PROBLEMA / PROPÓSITO -->
            <!-- ===================================================== -->
            <section
                id="comunidad"
                class="px-6 lg:px-8 py-20"
            >
                <div class="max-w-7xl mx-auto">

                    <div class="text-center max-w-3xl mx-auto">
                        <span
                            class="text-primary font-bold
                                   uppercase tracking-wider text-sm"
                        >
                            Información cuando más importa
                        </span>

                        <h2
                            class="text-4xl lg:text-5xl
                                   font-bold mt-3 mb-5"
                        >
                            Un corte de energía afecta más que la iluminación
                        </h2>

                        <p
                            class="text-lg text-muted-color
                                   leading-relaxed"
                        >
                            ApagónYa busca reunir en un mismo lugar
                            los reportes de la comunidad para que vecinos,
                            técnicos y administradores tengan información
                            clara sobre cada interrupción.
                        </p>
                    </div>


                    <div
                        class="grid grid-cols-12 gap-6
                               mt-14"
                    >
                        <article
                            class="col-span-12 md:col-span-4
                                   p-7 rounded-2xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   bg-surface-0
                                   dark:bg-surface-900
                                   hover:shadow-lg transition-shadow"
                        >
                            <div
                                class="w-14 h-14 rounded-2xl
                                       bg-primary-50
                                       dark:bg-primary-900
                                       flex items-center justify-center mb-6"
                            >
                                <i
                                    class="pi pi-bolt
                                           text-primary text-2xl"
                                ></i>
                            </div>

                            <h3 class="text-xl mb-3">
                                Reporta rápidamente
                            </h3>

                            <p
                                class="text-muted-color
                                       leading-relaxed m-0"
                            >
                                Registra el corte indicando tu zona,
                                una dirección aproximada, hora de inicio
                                y evidencia fotográfica.
                            </p>
                        </article>


                        <article
                            class="col-span-12 md:col-span-4
                                   p-7 rounded-2xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   bg-surface-0
                                   dark:bg-surface-900
                                   hover:shadow-lg transition-shadow"
                        >
                            <div
                                class="w-14 h-14 rounded-2xl
                                       bg-primary-50
                                       dark:bg-primary-900
                                       flex items-center justify-center mb-6"
                            >
                                <i
                                    class="pi pi-users
                                           text-primary text-2xl"
                                ></i>
                            </div>

                            <h3 class="text-xl mb-3">
                                Confirma con tu comunidad
                            </h3>

                            <p
                                class="text-muted-color
                                       leading-relaxed m-0"
                            >
                                Si un vecino ya reportó el corte,
                                evita duplicarlo y confirma que
                                la misma incidencia también te afecta.
                            </p>
                        </article>


                        <article
                            class="col-span-12 md:col-span-4
                                   p-7 rounded-2xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   bg-surface-0
                                   dark:bg-surface-900
                                   hover:shadow-lg transition-shadow"
                        >
                            <div
                                class="w-14 h-14 rounded-2xl
                                       bg-primary-50
                                       dark:bg-primary-900
                                       flex items-center justify-center mb-6"
                            >
                                <i
                                    class="pi pi-history
                                           text-primary text-2xl"
                                ></i>
                            </div>

                            <h3 class="text-xl mb-3">
                                Consulta el seguimiento
                            </h3>

                            <p
                                class="text-muted-color
                                       leading-relaxed m-0"
                            >
                                Conoce si el reporte fue verificado,
                                confirmado o resuelto y consulta el
                                historial de interrupciones de tu sector.
                            </p>
                        </article>
                    </div>

                </div>
            </section>


            <!-- ===================================================== -->
            <!-- CÓMO FUNCIONA -->
            <!-- ===================================================== -->
            <section
                id="como-funciona"
                class="bg-surface-50
                       dark:bg-surface-900
                       px-6 lg:px-8 py-20"
            >
                <div class="max-w-7xl mx-auto">

                    <div class="text-center mb-14">
                        <span
                            class="text-primary
                                   font-bold uppercase
                                   tracking-wider text-sm"
                        >
                            Seguimiento completo
                        </span>

                        <h2
                            class="text-4xl lg:text-5xl
                                   font-bold mt-3 mb-4"
                        >
                            Del reporte a la resolución
                        </h2>

                        <p class="text-lg text-muted-color">
                            Cada incidencia sigue un proceso claro
                            y auditable.
                        </p>
                    </div>


                    <div
                        class="grid grid-cols-12
                               gap-6 max-w-6xl mx-auto"
                    >

                        <!-- PASO 1 -->
                        <div
                            class="col-span-12 md:col-span-6
                                   lg:col-span-3"
                        >
                            <div
                                class="h-full
                                       bg-surface-0
                                       dark:bg-surface-950
                                       border border-surface-200
                                       dark:border-surface-800
                                       rounded-2xl p-6"
                            >
                                <div
                                    class="w-12 h-12 rounded-full
                                           bg-primary text-white
                                           flex items-center
                                           justify-center
                                           text-lg font-bold mb-5"
                                >
                                    1
                                </div>

                                <h3 class="text-xl mb-2">
                                    Nuevo
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed m-0"
                                >
                                    Un ciudadano registra el corte
                                    ocurrido en su zona.
                                </p>
                            </div>
                        </div>


                        <!-- PASO 2 -->
                        <div
                            class="col-span-12 md:col-span-6
                                   lg:col-span-3"
                        >
                            <div
                                class="h-full
                                       bg-surface-0
                                       dark:bg-surface-950
                                       border border-surface-200
                                       dark:border-surface-800
                                       rounded-2xl p-6"
                            >
                                <div
                                    class="w-12 h-12 rounded-full
                                           bg-primary text-white
                                           flex items-center
                                           justify-center
                                           text-lg font-bold mb-5"
                                >
                                    2
                                </div>

                                <h3 class="text-xl mb-2">
                                    En verificación
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed m-0"
                                >
                                    El técnico de zona revisa
                                    la información del reporte.
                                </p>
                            </div>
                        </div>


                        <!-- PASO 3 -->
                        <div
                            class="col-span-12 md:col-span-6
                                   lg:col-span-3"
                        >
                            <div
                                class="h-full
                                       bg-surface-0
                                       dark:bg-surface-950
                                       border border-surface-200
                                       dark:border-surface-800
                                       rounded-2xl p-6"
                            >
                                <div
                                    class="w-12 h-12 rounded-full
                                           bg-primary text-white
                                           flex items-center
                                           justify-center
                                           text-lg font-bold mb-5"
                                >
                                    3
                                </div>

                                <h3 class="text-xl mb-2">
                                    Confirmado
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed m-0"
                                >
                                    La comunidad confirma que
                                    la interrupción también afecta
                                    a otros vecinos.
                                </p>
                            </div>
                        </div>


                        <!-- PASO 4 -->
                        <div
                            class="col-span-12 md:col-span-6
                                   lg:col-span-3"
                        >
                            <div
                                class="h-full
                                       bg-surface-0
                                       dark:bg-surface-950
                                       border border-surface-200
                                       dark:border-surface-800
                                       rounded-2xl p-6"
                            >
                                <div
                                    class="w-12 h-12 rounded-full
                                           bg-green-500 text-white
                                           flex items-center
                                           justify-center
                                           text-lg font-bold mb-5"
                                >
                                    <i class="pi pi-check"></i>
                                </div>

                                <h3 class="text-xl mb-2">
                                    Resuelto
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed m-0"
                                >
                                    El técnico registra la resolución
                                    y la hora de restablecimiento.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <!-- ===================================================== -->
            <!-- ROLES -->
            <!-- ===================================================== -->
            <section
                id="roles"
                class="px-6 lg:px-8 py-20"
            >
                <div class="max-w-7xl mx-auto">

                    <div class="text-center mb-14">
                        <span
                            class="text-primary font-bold
                                   uppercase tracking-wider text-sm"
                        >
                            Una plataforma, tres perspectivas
                        </span>

                        <h2
                            class="text-4xl lg:text-5xl
                                   font-bold mt-3"
                        >
                            Diseñada para toda la comunidad
                        </h2>
                    </div>


                    <div class="grid grid-cols-12 gap-6">

                        <!-- CIUDADANO -->
                        <article
                            class="col-span-12 lg:col-span-4
                                   rounded-3xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   overflow-hidden
                                   bg-surface-0
                                   dark:bg-surface-900"
                        >
                            <div
                                class="h-2 bg-primary"
                            ></div>

                            <div class="p-8">
                                <div
                                    class="w-14 h-14
                                           rounded-2xl bg-primary-50
                                           dark:bg-primary-900
                                           flex items-center
                                           justify-center mb-6"
                                >
                                    <i
                                        class="pi pi-users
                                               text-primary text-2xl"
                                    ></i>
                                </div>

                                <h3 class="text-2xl mb-3">
                                    Ciudadanía
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed"
                                >
                                    Participa activamente reportando
                                    y confirmando interrupciones
                                    de energía en tu zona.
                                </p>

                                <div class="mt-6 flex flex-col gap-3">
                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Registrar cortes</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Adjuntar evidencia</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Confirmar reportes</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Consultar historial</span>
                                    </div>
                                </div>
                            </div>
                        </article>


                        <!-- TÉCNICO -->
                        <article
                            class="col-span-12 lg:col-span-4
                                   rounded-3xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   overflow-hidden
                                   bg-surface-0
                                   dark:bg-surface-900"
                        >
                            <div
                                class="h-2 bg-orange-500"
                            ></div>

                            <div class="p-8">
                                <div
                                    class="w-14 h-14 rounded-2xl
                                           bg-orange-50
                                           dark:bg-orange-950
                                           flex items-center
                                           justify-center mb-6"
                                >
                                    <i
                                        class="pi pi-wrench
                                               text-orange-500
                                               text-2xl"
                                    ></i>
                                </div>

                                <h3 class="text-2xl mb-3">
                                    Técnicos de zona
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed"
                                >
                                    Gestionan los reportes correspondientes
                                    a su área y mantienen informada
                                    a la comunidad.
                                </p>

                                <div class="mt-6 flex flex-col gap-3">
                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Recibir reportes asignados</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Verificar incidencias</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Registrar causas</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Registrar resolución</span>
                                    </div>
                                </div>
                            </div>
                        </article>


                        <!-- ADMIN -->
                        <article
                            class="col-span-12 lg:col-span-4
                                   rounded-3xl
                                   border border-surface-200
                                   dark:border-surface-800
                                   overflow-hidden
                                   bg-surface-0
                                   dark:bg-surface-900"
                        >
                            <div
                                class="h-2 bg-purple-500"
                            ></div>

                            <div class="p-8">
                                <div
                                    class="w-14 h-14
                                           rounded-2xl
                                           bg-purple-50
                                           dark:bg-purple-950
                                           flex items-center
                                           justify-center mb-6"
                                >
                                    <i
                                        class="pi pi-chart-bar
                                               text-purple-500
                                               text-2xl"
                                    ></i>
                                </div>

                                <h3 class="text-2xl mb-3">
                                    Administración
                                </h3>

                                <p
                                    class="text-muted-color
                                           leading-relaxed"
                                >
                                    Supervisa el funcionamiento general
                                    y analiza el comportamiento
                                    de los cortes por sector.
                                </p>

                                <div class="mt-6 flex flex-col gap-3">
                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Gestionar técnicos</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Supervisar reportes</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Analizar recurrencia</span>
                                    </div>

                                    <div class="flex gap-3">
                                        <i
                                            class="pi pi-check
                                                   text-green-500 mt-1"
                                        ></i>
                                        <span>Consultar estadísticas</span>
                                    </div>
                                </div>
                            </div>
                        </article>

                    </div>
                </div>
            </section>


            <!-- ===================================================== -->
            <!-- CTA -->
            <!-- ===================================================== -->
            <section class="px-6 lg:px-8 py-20">
                <div
                    class="max-w-7xl mx-auto
                           rounded-3xl
                           bg-primary
                           px-8 lg:px-16
                           py-14
                           text-white
                           overflow-hidden
                           relative"
                >

                    <div
                        class="absolute
                               -right-20 -top-20
                               w-72 h-72
                               rounded-full
                               bg-white/10"
                    ></div>

                    <div
                        class="relative
                               flex flex-col lg:flex-row
                               lg:items-center
                               lg:justify-between gap-8"
                    >
                        <div class="max-w-3xl">
                            <div
                                class="text-sm
                                       uppercase
                                       tracking-widest
                                       font-semibold
                                       opacity-80 mb-3"
                            >
                                Participación ciudadana
                            </div>

                            <h2
                                class="text-4xl lg:text-5xl
                                       font-bold m-0"
                            >
                                Tu reporte puede ayudar a toda tu zona.
                            </h2>

                            <p
                                class="text-lg
                                       mt-5 mb-0
                                       opacity-90
                                       leading-relaxed"
                            >
                                Regístrate, reporta una interrupción
                                y mantente informado sobre su seguimiento
                                hasta el restablecimiento del servicio.
                            </p>
                        </div>

                        <div class="flex-shrink-0">
                            <p-button
                                label="Crear mi cuenta"
                                icon="pi pi-user-plus"
                                size="large"
                                severity="secondary"
                                routerLink="/registro"
                            />
                        </div>
                    </div>
                </div>
            </section>


            <!-- ===================================================== -->
            <!-- FOOTER -->
            <!-- ===================================================== -->
            <footer
                class="border-t
                       border-surface-200
                       dark:border-surface-800
                       bg-surface-50
                       dark:bg-surface-900"
            >
                <div
                    class="max-w-7xl mx-auto
                           px-6 lg:px-8 py-10"
                >
                    <div
                        class="flex flex-col md:flex-row
                               md:items-center
                               justify-between gap-6"
                    >

                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10
                                       rounded-xl
                                       bg-primary
                                       flex items-center
                                       justify-center"
                            >
                                <i
                                    class="pi pi-bolt
                                           text-white"
                                ></i>
                            </div>

                            <div>
                                <div class="font-bold">
                                    ApagónYa
                                </div>

                                <div
                                    class="text-sm
                                           text-muted-color"
                                >
                                    Reporta el corte, avisa a tu zona,
                                    exige respuestas.
                                </div>
                            </div>
                        </div>


                        <div
                            class="text-sm
                                   text-muted-color"
                        >
                            Proyecto académico · Programación Web
                        </div>
                    </div>
                </div>
            </footer>

        </main>
    `,
    styles: [`
        :host {
            display: block;
        }

        html {
            scroll-behavior: smooth;
        }

        article {
            transition:
                transform .2s ease,
                box-shadow .2s ease,
                border-color .2s ease;
        }

        article:hover {
            transform: translateY(-4px);
        }
    `]
    // template: `
    //     <main class="min-h-screen bg-surface-0 dark:bg-surface-950">
    //         <nav class="flex items-center justify-between px-6 lg:px-20 py-5 border-b border-surface-200 dark:border-surface-800">
    //             <a routerLink="/" class="flex items-center gap-3 no-underline text-color"><i class="pi pi-bolt text-primary text-3xl"></i><span class="text-2xl font-bold">ApagónYa</span></a>
    //             <div class="flex gap-3"><p-button label="Iniciar sesión" routerLink="/auth/login" text /><p-button label="Crear cuenta" routerLink="/registro" /></div>
    //         </nav>

    //         <section class="px-6 lg:px-20 py-20 lg:py-28 text-center bg-gradient-to-b from-primary-50 to-surface-0 dark:from-surface-900 dark:to-surface-950">
    //             <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium mb-6"><i class="pi pi-map-marker"></i> Información comunitaria para Honduras</div>
    //             <h1 class="text-5xl lg:text-7xl font-bold m-0 max-w-5xl mx-auto leading-tight">Reporta el corte, avisa a tu zona, exige respuestas</h1>
    //             <p class="text-xl lg:text-2xl text-muted-color max-w-3xl mx-auto mt-6 leading-relaxed">Registra y confirma cortes de energía, sigue su verificación y conoce cuándo se restablece el servicio.</p>
    //             <div class="flex flex-wrap justify-center gap-4 mt-8"><p-button label="Reportar un corte" icon="pi pi-bolt" size="large" routerLink="/registro" /><p-button label="Entrar al sistema" icon="pi pi-sign-in" size="large" severity="secondary" routerLink="/auth/login" /></div>
    //         </section>

    //         <section class="px-6 lg:px-20 py-16">
    //             <h2 class="text-4xl text-center mb-12">Una plataforma para toda la comunidad</h2>
    //             <div class="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
    //                 <article class="card col-span-12 lg:col-span-4"><i class="pi pi-users text-primary text-3xl"></i><h3>Ciudadanía</h3><p class="text-muted-color leading-relaxed">Reporta cortes con evidencia fotográfica, confirma “a mí también” y consulta el historial de su zona.</p></article>
    //                 <article class="card col-span-12 lg:col-span-4"><i class="pi pi-wrench text-primary text-3xl"></i><h3>Técnicos de zona</h3><p class="text-muted-color leading-relaxed">Aceptan reportes asignados, verifican el corte y registran una resolución inmutable.</p></article>
    //                 <article class="card col-span-12 lg:col-span-4"><i class="pi pi-chart-bar text-primary text-3xl"></i><h3>Administración</h3><p class="text-muted-color leading-relaxed">Supervisa recurrencia, estados, carga técnica y tiempos de resolución mediante reportes visuales.</p></article>
    //             </div>
    //         </section>

    //         <section class="px-6 lg:px-20 py-16 bg-surface-50 dark:bg-surface-900">
    //             <h2 class="text-4xl text-center mb-12">Del reporte a la resolución</h2>
    //             <div class="grid grid-cols-12 gap-6 max-w-6xl mx-auto text-center">
    //                 <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">1</div><h3>Nuevo</h3><p class="text-muted-color">Un ciudadano registra el corte.</p></div>
    //                 <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">2</div><h3>En verificación</h3><p class="text-muted-color">El técnico asignado acepta y revisa.</p></div>
    //                 <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">3</div><h3>Confirmado</h3><p class="text-muted-color">La comunidad valida la afectación.</p></div>
    //                 <div class="col-span-12 md:col-span-3"><div class="text-4xl font-bold text-primary">4</div><h3>Resuelto</h3><p class="text-muted-color">Se registra la hora de restablecimiento.</p></div>
    //             </div>
    //         </section>

    //         <footer class="px-6 lg:px-20 py-8 flex flex-wrap justify-between gap-4"><span class="font-semibold">ApagónYa</span><span class="text-muted-color">Seguimiento comunitario de cortes de energía.</span></footer>
    //     </main>
    // `
})
export class Landing {}

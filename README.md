# ApagónYa Web

Cliente Angular 20 con Angular Material, PrimeNG, Chart.js y Firebase SDK para el backend ApagónYa.

## Desarrollo

Inicie primero la API en `https://localhost:7244` y después ejecute:

```powershell
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`. El servidor de desarrollo usa `proxy.conf.json` para enviar `/api` hacia ASP.NET Core.

## Módulos funcionales

- Registro, inicio/cierre de sesión, renovación y recuperación de contraseña.
- Dashboard con filtros y gráficos de barras, dona y tendencias semanales o mensuales.
- Catálogo administrativo de zonas.
- Cortes programados por zona con mantenimiento administrativo y consulta por los tres roles.
- Técnicos con alta, edición, zona, disponibilidad, estado y carga activa.
- Reportes con filtros, alta multipart, edición, asignación, aceptación, reasignación, confirmación y resolución.
- Historial de auditoría y manejo de duplicados mediante “A mí también”.
- Notificaciones con lectura, prioridad y actualización en tiempo real.

La navegación usa guardas y opciones por rol; el backend continúa siendo la autoridad final de autorización. Las escuchas de Firebase son de solo lectura y respetan las reglas incluidas en la raíz del repositorio.

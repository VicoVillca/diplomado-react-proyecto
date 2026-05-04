# Lista de Tareas

Aplicación de lista de tareas creada con React, TypeScript y Vite.

## Qué hace

- Muestra tareas del usuario autenticado.
- Permite crear nuevas tareas.
- Permite editar tareas desde un modal.
- Permite eliminar tareas desde un modal.
- Permite cambiar el estado entre pendiente y finalizada con un switch.

## Cómo usar

1. Instala dependencias:

```bash
npm install
```

2. Inicia la aplicación en desarrollo:

```bash
npm run dev
```

3. Abre el navegador en la URL que muestre Vite.

## API

La app consume los endpoints de tareas en:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Notas

- Usa la variable de entorno `VITE_API_URL` para configurar la URL base.
- Asegúrate de estar autenticado para acceder a las rutas de tareas.

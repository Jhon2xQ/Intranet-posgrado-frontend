# Prompt para Implementar Recuperación de Contraseña en React + Vite

Quiero que leas la estructura completa de mi proyecto React con Vite y
generes **dos nuevas interfaces funcionales**

Mi proyecto tiene un login, pero aún **no tiene recuperación de
contraseña**. Quiero que generes el código EXACTO que debo agregar para
que funcione correctamente.

------------------------------------------------------------------------

## 🔵 1. Pantalla: Forgot Password

Ruta: **`/forgot-password`**

Debe tener:

-   Un campo donde el usuario ingrese su **código** (6 caracteres).\
-   Un botón **Enviar**.\
-   **Regresar** que mande de vuelta al login (ruta ya
    existente).

Cuando se oprima "Enviar", debe llamar a este endpoint:

### POST `/auth/forgot-password`

Body:

``` json
{ "codigo": "XXXXXX" }
```

La respuesta del backend puede ser:

### ✔️ Success:

``` json
{
  "success": true,
  "message": "Se envió un mensaje a su correo institucional: 184855@unsaac.edu.pe",
  "data": null,
  "timestamp": 1764177064888
}
```

### ❌ Error:

``` json
{
  "success": false,
  "message": "Error al restaurar contraseña: Usuario no encontrado",
  "data": null,
  "timestamp": 1764177144827
}
```

### ❗ Requisito obligatorio:

Debes mostrar **EXACTAMENTE** el mensaje que devuelve el backend, sin
modificarlo.

------------------------------------------------------------------------

## 🔵 2. Pantalla: Update Forgot Password

Esta pantalla se accede desde un enlace que llega por correo:

`https://midominio.com/update-forgot-password?token=<TOKEN>`

Debe tener:

-   Campo **nueva contraseña**
-   Campo **confirmar contraseña**
-   Botón enviar
-   **Regresar** al login

El request debe enviarse a:

### PUT `/auth/update-forgot-password?token=<TOKEN>`

Body:

``` json
{ "nuevaContrasenia": "LA NUEVA CONTRASEÑA" }
```

Ejemplo de error:

``` json
{
  "success": false,
  "message": "Error al actualizar la contraseña: El token ya esta usado",
  "data": null,
  "timestamp": 1764173306763
}
```

✔️ También aquí debes mostrar **exactamente el message** que venga del
backend.

------------------------------------------------------------------------

## 📌 IMPORTANTE
-   Usar los componentes, hooks, servicios o estructura interna tal como
    ya existe en mi proyecto.
-   Adaptar el código a mi forma actual de manejar rutas, peticiones y
    componentes.
-   Si uso axios, fetch, custom hooks o context, debes detectarlo y
    adaptarte.
-   Si mi proyecto usa layout, wrappers o controladores de rutas, úsalo
    también.
-   Generar código limpio y funcional.

------------------------------------------------------------------------

## 🟢 Objetivo final

Que generes los archivos y código exactos para:

-   La pantalla **Forgot Password**
-   La pantalla **Update Forgot Password**
-   Las rutas necesarias
-   Los servicios o funciones requeridas
-   Los botones de navegación
-   El manejo de mensajes del backend

Todo integrado a mi proyecto

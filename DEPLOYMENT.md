# Guía de Despliegue

## Configuración de Base Path

Este proyecto soporta despliegue en diferentes rutas base usando la variable de entorno `VITE_BASE_PATH`.

### Variables de Entorno

#### VITE_BASE_PATH

Define la ruta base donde se desplegará la aplicación.

**Valores comunes:**

- `/` - Para despliegue en la raíz del dominio (por defecto)
- `/dev/` - Para despliegue en un subdirectorio de desarrollo
- `/intranet/` - Para despliegue en un subdirectorio personalizado

### Configuración para Desarrollo Local

En el archivo `.env`:

```env
VITE_BASE_PATH=/
```

### Configuración para Producción

#### Opción 1: Despliegue en Raíz

```env
VITE_BASE_PATH=/
```

Acceso: `https://tudominio.com/`

#### Opción 2: Despliegue en Subdirectorio

```env
VITE_BASE_PATH=/dev/
```

Acceso: `https://tudominio.com/dev/`

### Build para Producción

```bash
# 1. Configurar la variable de entorno
# Editar .env o crear .env.production

# 2. Construir el proyecto
npm run build

# 3. Los archivos estarán en la carpeta dist/
```

### Ejemplo de Configuración en Servidor

#### Nginx

Para despliegue en subdirectorio `/dev/`:

```nginx
location /dev/ {
    alias /ruta/a/tu/dist/;
    try_files $uri $uri/ /dev/index.html;
}
```

#### Apache

Para despliegue en subdirectorio `/dev/`:

```apache
<Directory "/ruta/a/tu/dist">
    RewriteEngine On
    RewriteBase /dev/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /dev/index.html [L]
</Directory>
```

### Variables de Entorno en Docker

Si usas Docker, puedes pasar la variable en tiempo de build:

```dockerfile
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN npm run build
```

O en docker-compose:

```yaml
services:
  frontend:
    build:
      context: .
      args:
        VITE_BASE_PATH: /dev/
```

### Notas Importantes

1. **Siempre incluye las barras**: `/dev/` no `/dev`
2. **Reconstruye después de cambiar**: Los cambios en `VITE_BASE_PATH` requieren rebuild
3. **Verifica las rutas**: Asegúrate que el servidor web esté configurado correctamente
4. **API URL**: No olvides configurar también `VITE_API_URL` según tu entorno

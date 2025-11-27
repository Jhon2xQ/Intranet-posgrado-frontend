# Guía de Despliegue

## Variables de Entorno

### VITE_BASE_PATH

Define la ruta base donde se desplegará la aplicación.

**Ejemplos:**

- `/` - Raíz del dominio (por defecto)
- `/dev/` - Subdirectorio de desarrollo
- `/intranet/` - Subdirectorio personalizado

## Configuración

### 1. Desarrollo Local

```env
VITE_BASE_PATH=/
VITE_API_URL=http://localhost:8080/api
```

### 2. Producción en Raíz

```env
VITE_BASE_PATH=/
VITE_API_URL=https://api.tudominio.com/api
```

Acceso: `https://tudominio.com/`

### 3. Producción en Subdirectorio

```env
VITE_BASE_PATH=/dev/
VITE_API_URL=https://api.tudominio.com/api
```

Acceso: `https://tudominio.com/dev/`

## Build

```bash
# 1. Configurar .env o .env.production
# 2. Construir
npm run build

# 3. Los archivos estarán en dist/
```

## Configuración del Servidor

### Nginx

```nginx
location /dev/ {
    alias /ruta/a/tu/dist/;
    try_files $uri $uri/ /dev/index.html;
}
```

### Apache

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

## Docker

### Dockerfile

```dockerfile
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN npm run build
```

### docker-compose.yml

```yaml
services:
  frontend:
    build:
      context: .
      args:
        VITE_BASE_PATH: /dev/
```

## Notas Importantes

1. **Siempre incluye las barras**: `/dev/` no `/dev`
2. **Reconstruye después de cambiar**: Los cambios en `VITE_BASE_PATH` requieren rebuild
3. **Configura CORS**: Asegúrate que el backend acepte peticiones desde tu dominio
4. **HTTPS en producción**: Recomendado para seguridad

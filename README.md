# UNSAAC Intranet - Sistema de Estudiantes de Posgrado

Sistema web completo desarrollado en React con TailwindCSS para la gestión de estudiantes de posgrado de la Universidad Nacional de San Antonio Abad del Cusco (UNSAAC).

## 🚀 Características

- **Autenticación segura** con JWT y refresh tokens
- **Dashboard interactivo** con avisos y enlaces importantes
- **Gestión de notas** por semestre con estadísticas
- **Estado de pagos** con resumen financiero y progreso visual
- **Perfil de usuario** con cambio de contraseña
- **Diseño responsivo** y moderno con efectos glassmorphism
- **Notificaciones** en tiempo real
- **Integración completa** con API backend

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **TailwindCSS 3** - Estilos y diseño responsivo
- **React Router DOM 6** - Navegación y rutas
- **Axios** - Cliente HTTP con interceptores
- **Context API** - Gestión de estado global
- **Google Fonts (Poppins)** - Tipografía elegante

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   ├── images/          # Imágenes y logos
│   └── fonts/           # Fuentes personalizadas
├── components/
│   ├── common/          # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotificationToast.jsx
│   │   └── ProtectedRoute.jsx
│   ├── layout/          # Componentes de layout
│   │   └── Header.jsx
│   └── ui/              # Componentes UI específicos
│       ├── NoticesCarousel.jsx
│       └── PaymentSummary.jsx
├── contexts/
│   └── AuthContext.js   # Context de autenticación
├── hooks/
│   └── useNotification.js # Hook para notificaciones
├── pages/
│   ├── Auth/
│   │   └── Login.jsx    # Página de login
│   ├── Dashboard.jsx    # Dashboard principal
│   ├── Notas.jsx        # Gestión de notas
│   ├── Pagos.jsx        # Estado de pagos
│   └── Perfil.jsx       # Perfil de usuario
├── services/
│   ├── api.js           # Configuración de Axios
│   ├── auth.js          # Servicios de autenticación
│   └── user.js          # Servicios de usuario
├── utils/
│   ├── formatters.js    # Utilidades de formato
│   └── validators.js    # Validaciones de formularios
├── App.jsx              # Componente principal
├── main.jsx             # Punto de entrada
├── index.css            # Estilos globales
└── constants.js         # Constantes y configuración
```

## 🎨 Diseño y Estilo

### Paleta de Colores
- **Primario**: Tonos azules (#3b82f6, #2563eb, #1d4ed8)
- **Secundario**: Tonos celestes (#0ea5e9, #0284c7, #0369a1)
- **Fondo**: Imagen fija con overlay glassmorphism

### Tipografía
- **Fuente principal**: Poppins (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Efectos Visuales
- **Glassmorphism**: Efectos de vidrio con blur y transparencia
- **Animaciones**: Transiciones suaves y micro-interacciones
- **Responsivo**: Diseño adaptable a todos los dispositivos

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración específica
```

### Variables de Entorno
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api

# Development Settings
REACT_APP_ENV=development

# Frontend Port Configuration
PORT=5173

# Host Configuration (for external access)
HOST=0.0.0.0
```

### Ejecutar en Desarrollo
```bash
# El frontend se ejecutará en puerto 5173
npm start
```

### Acceso desde Otros Dispositivos

#### 1. Configurar el Frontend
El frontend ya está configurado para aceptar conexiones externas (`HOST=0.0.0.0`).

#### 2. Configurar el Backend
Para acceso desde otros dispositivos, necesitas:

1. **Obtener tu IP local:**
   ```bash
   # Linux/Mac
   ip addr show
   # O usar
   hostname -I
   ```

2. **Actualizar .env con tu IP:**
   ```env
   REACT_APP_API_URL=http://TU_IP_LOCAL:8080/api
   # Ejemplo: REACT_APP_API_URL=http://192.168.1.100:8080/api
   ```

3. **Configurar el backend para aceptar conexiones externas:**
   - Asegúrate de que el backend esté configurado para escuchar en `0.0.0.0:8080`
   - Verifica que no haya firewall bloqueando el puerto 8080

#### 3. Acceder desde Otro Dispositivo
```
http://TU_IP_LOCAL:5173
```

### Construir para Producción
```bash
npm run build
```

## 🔌 Integración con API

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token
- `PUT /api/auth/password` - Cambiar contraseña

#### Usuario
- `GET /api/users/academica` - Información académica
- `GET /api/users/personal` - Información personal

#### Estudiante
- `GET /api/estudiante/notas` - Notas del estudiante
- `GET /api/estudiante/pagos` - Pagos del estudiante

#### Avisos
- `GET /api/notices/avisos` - Avisos importantes
- `GET /api/notices/enlaces` - Enlaces importantes

### Autenticación
El sistema utiliza JWT con refresh tokens automático:
- **Access Token**: Almacenado en localStorage
- **Refresh Token**: Manejado con cookies HTTP-only
- **Interceptores**: Renovación automática de tokens

## 📱 Funcionalidades por Página

### 🏠 Dashboard
- Bienvenida personalizada
- Información académica del estudiante
- Carrusel de avisos importantes
- Enlaces importantes
- Accesos rápidos a otras secciones

### 📊 Notas
- Información del estudiante
- Selector de semestre
- Tabla de notas con estado (aprobado/desaprobado)
- Estadísticas por semestre
- Promedio calculado

### 💳 Pagos
- Estado de deuda (Sí/No)
- Resumen financiero con barra de progreso
- Historial completo de pagos
- Estadísticas de pagos
- Enlaces a sistemas de pago externos

### 👤 Perfil
- Información personal completa
- Cambio de contraseña seguro
- Validaciones de seguridad
- Accesos rápidos

## 🔒 Seguridad

- **Rutas protegidas** con autenticación requerida
- **Validación de formularios** en cliente y servidor
- **Tokens JWT** con expiración automática
- **Refresh automático** de tokens
- **Logout seguro** con limpieza de datos

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegación adaptable**: Menú hamburguesa en móviles
- **Tablas responsivas**: Scroll horizontal en pantallas pequeñas

## 🎯 Características Avanzadas

### Notificaciones
- Sistema de toasts para feedback
- Tipos: success, error, warning, info
- Auto-dismiss configurable

### Estados de Carga
- Spinners elegantes
- Estados de carga por componente
- Manejo de errores graceful

### Optimizaciones
- Lazy loading de componentes
- Memoización con React.memo
- Debounce en búsquedas
- Optimización de re-renders

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Servidor Web
El proyecto genera archivos estáticos que pueden servirse desde cualquier servidor web (Apache, Nginx, etc.).

### Variables de Producción
Configurar `REACT_APP_API_URL` con la URL del API en producción.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Créditos

Desarrollado para la **Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**
- Sistema de Posgrado
- Estudiantes de Maestría y Doctorado

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2024

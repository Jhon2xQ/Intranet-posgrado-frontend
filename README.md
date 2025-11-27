# UNSAAC Intranet - Sistema de Estudiantes de Posgrado

Sistema web para la gestión de estudiantes de posgrado de la Universidad Nacional de San Antonio Abad del Cusco (UNSAAC).

## �️ aTecnologías

- React 18.2
- TailwindCSS 3.3
- React Router DOM 6.11
- Axios 1.4
- Vite 7.1

## 📁 Estructura del Proyecto

```
unsaac-intranet/
├── src/
│   ├── assets/
│   │   ├── images/              # Logos de la universidad (claro/oscuro)
│   │   └── fonts/               # Iconos SVG personalizados
│   │
│   ├── components/
│   │   ├── common/              # Componentes reutilizables
│   │   │   ├── ApiTest.jsx      # Componente de prueba de API
│   │   │   ├── Button.jsx       # Botón con estados de carga
│   │   │   ├── Input.jsx        # Input con validación
│   │   │   ├── LoadingSpinner.jsx # Spinner de carga
│   │   │   ├── NotificationToast.jsx # Sistema de notificaciones
│   │   │   └── ProtectedRoute.jsx # HOC para rutas protegidas
│   │   │
│   │   ├── layout/              # Componentes de estructura
│   │   │   └── Header.jsx       # Header con navegación y tema
│   │   │
│   │   └── ui/                  # Componentes UI específicos
│   │       ├── NoticesCarousel.jsx # Carrusel de avisos
│   │       └── PaymentSummary.jsx  # Resumen de pagos
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Context de autenticación con reducer
│   │   └── ThemeContext.jsx     # Context de tema claro/oscuro
│   │
│   ├── hooks/
│   │   └── useNotification.js   # Hook para sistema de notificaciones
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx        # Página de inicio de sesión
│   │   │   ├── ForgotPassword.jsx # Recuperación de contraseña
│   │   │   ├── UpdateForgotPassword.jsx # Actualizar contraseña olvidada
│   │   │   └── ChangePassword.jsx # Cambio de contraseña (primera sesión)
│   │   │
│   │   ├── Dashboard.jsx        # Dashboard principal con avisos
│   │   ├── Notas.jsx            # Gestión de notas por semestre
│   │   ├── Pagos.jsx            # Estado de pagos e historial
│   │   └── Perfil.jsx           # Perfil y datos personales
│   │
│   ├── services/
│   │   ├── api.js               # Configuración de Axios con interceptores
│   │   ├── auth.js              # Servicios de autenticación
│   │   └── user.js              # Servicios de datos de usuario
│   │
│   ├── utils/
│   │   ├── formatters.js        # Utilidades de formato (fechas, moneda)
│   │   └── validators.js        # Validaciones de formularios
│   │
│   ├── App.jsx                  # Componente raíz con rutas
│   ├── main.jsx                 # Punto de entrada de React
│   ├── index.css                # Estilos globales y Tailwind
│   └── constants.js             # Constantes y configuración de API
│
├── public/                      # Archivos estáticos
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── eslint.config.js             # Configuración de ESLint
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── postcss.config.cjs           # Configuración de PostCSS
├── tailwind.config.cjs          # Configuración de Tailwind
├── vite.config.js               # Configuración de Vite
├── README.md                    # Documentación principal
└── DEPLOYMENT.md                # Guía de despliegue
```

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# Iniciar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## ⚙️ Variables de Entorno

```env
# URL del backend API
VITE_API_URL=http://localhost:8080/api

# Ruta base para despliegue
VITE_BASE_PATH=/

# Puerto del servidor de desarrollo
PORT=5173

# Permitir acceso desde otros dispositivos
HOST=0.0.0.0
```

---

JAQQ

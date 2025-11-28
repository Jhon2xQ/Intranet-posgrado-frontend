import api from "./api";
import { API_ENDPOINTS, STORAGE_KEYS } from "../constants";

const isDevelopment = import.meta.env.VITE_ENV === "development";

export const authService = {
  // Login user
  async login(credentials) {
    const backendUrl = `${api.defaults.baseURL}${API_ENDPOINTS.LOGIN}`;

    try {
      if (isDevelopment) {
        console.log("Attempting login with:", { usuario: credentials.usuario });
        console.log("Backend URL:", backendUrl);
      }

      const response = await api.post(API_ENDPOINTS.LOGIN, {
        usuario: credentials.usuario,
        contrasenia: credentials.contrasenia,
      });

      if (isDevelopment) {
        console.log("Login response:", response.data);
      }

      if (response.data.success) {
        const { accessToken, usuario, primeraSesion } = response.data.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.USERNAME, usuario);
        localStorage.setItem(STORAGE_KEYS.PRIMERA_SESION, primeraSesion ? "true" : "false");
        return response.data;
      }

      throw new Error(response.data.message || "Error en el login");
    } catch (error) {
      if (isDevelopment) {
        console.error("Login error:", error);
        console.error("Error code:", error.code);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }

      // No hay conexión con el backend
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK" || error.code === "ENOTFOUND") {
        if (isDevelopment) {
          throw new Error(
            `No se puede conectar al servidor backend.\n\nURL: ${backendUrl}\n\nVerifique que:\n- El backend esté ejecutándose\n- La URL sea correcta\n- No haya problemas de red o firewall`
          );
        } else {
          throw new Error("No se puede conectar al servidor. Intente más tarde.");
        }
      }

      // Timeout - El backend no responde a tiempo
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        if (isDevelopment) {
          throw new Error(
            `Tiempo de espera agotado al conectar con el backend.\n\nURL: ${backendUrl}\n\nEl servidor está tardando demasiado en responder.`
          );
        } else {
          throw new Error("El servidor no responde. Intente más tarde.");
        }
      }

      // Hay conexión con el backend - Errores de autenticación
      if (error.response?.status === 401 || error.response?.status === 403) {
        // El backend respondió pero las credenciales son incorrectas
        throw new Error("Usuario o contraseña incorrectos");
      }

      // Hay conexión con el backend - Error 400 (Bad Request)
      if (error.response?.status === 400) {
        if (isDevelopment) {
          throw new Error(
            `Solicitud inválida.\n\nURL: ${backendUrl}\n\nMensaje: ${error.response?.data?.message || "Datos enviados incorrectos"}`
          );
        } else {
          throw new Error(error.response?.data?.message || "Datos inválidos");
        }
      }

      // Hay conexión con el backend - Error 500 (Internal Server Error)
      if (error.response?.status === 500) {
        if (isDevelopment) {
          throw new Error(
            `Error interno del servidor.\n\nURL: ${backendUrl}\n\nMensaje: ${error.response?.data?.message || "Error en el backend"}`
          );
        } else {
          throw new Error("Error interno del servidor. Intente más tarde.");
        }
      }

      // Hay conexión con el backend - Otros errores HTTP
      if (error.response) {
        if (isDevelopment) {
          throw new Error(
            `Error del servidor (${error.response.status}).\n\nURL: ${backendUrl}\n\nMensaje: ${error.response?.data?.message || error.message}`
          );
        } else {
          throw new Error(error.response?.data?.message || "Error del servidor");
        }
      }

      // Error desconocido
      if (isDevelopment) {
        throw new Error(`Error desconocido.\n\nURL: ${backendUrl}\n\nMensaje: ${error.message}`);
      } else {
        throw new Error("Error de conexión. Intente más tarde.");
      }
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.PRIMERA_SESION);
    }
  },

  // Change password
  async changePassword(newPassword) {
    try {
      const response = await api.put(API_ENDPOINTS.CHANGE_PASSWORD, {
        nuevaContrasenia: newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al cambiar contraseña");
    }
  },

  // Forgot password - Send code
  async forgotPassword(codigo) {
    try {
      const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        codigo,
      });
      return response.data;
    } catch (error) {
      // Return the error response data directly if available, to show the exact message from backend
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw new Error(error.response?.data?.message || "Error al enviar código");
    }
  },

  // Update forgot password - Reset password with token
  async updateForgotPassword(token, nuevaContrasenia) {
    try {
      const response = await api.put(`${API_ENDPOINTS.UPDATE_FORGOT_PASSWORD}?token=${token}`, {
        nuevaContrasenia,
      });
      return response.data;
    } catch (error) {
      // Return the error response data directly if available, to show the exact message from backend
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw new Error(error.response?.data?.message || "Error al actualizar contraseña");
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Get current username
  getCurrentUsername() {
    return localStorage.getItem(STORAGE_KEYS.USERNAME);
  },

  // Check if it's first session
  isPrimeraSesion() {
    return localStorage.getItem(STORAGE_KEYS.PRIMERA_SESION) === "true";
  },
};

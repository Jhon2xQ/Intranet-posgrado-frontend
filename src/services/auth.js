import api from "./api";
import { API_ENDPOINTS, STORAGE_KEYS } from "../constants";

export const authService = {
  // Login user
  async login(credentials) {
    try {
      console.log("Attempting login with:", { usuario: credentials.usuario });
      console.log("API URL:", `${api.defaults.baseURL}${API_ENDPOINTS.LOGIN}`);

      const response = await api.post(API_ENDPOINTS.LOGIN, {
        usuario: credentials.usuario,
        contrasenia: credentials.contrasenia,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        const { accessToken, usuario, primeraSesion } = response.data.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.USERNAME, usuario);
        localStorage.setItem(
          STORAGE_KEYS.PRIMERA_SESION,
          primeraSesion ? "true" : "false"
        );
        return response.data;
      }

      throw new Error(response.data.message || "Error en el login");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        throw new Error(
          "No se puede conectar al servidor. Verifique que el backend esté ejecutándose en el puerto 8080."
        );
      }

      // Handle 401/403 errors specifically for incorrect credentials
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      throw new Error(
        error.response?.data?.message || error.message || "Error de conexión"
      );
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
      throw new Error(
        error.response?.data?.message || "Error al cambiar contraseña"
      );
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
      throw new Error(
        error.response?.data?.message || "Error al enviar código"
      );
    }
  },

  // Update forgot password - Reset password with token
  async updateForgotPassword(token, nuevaContrasenia) {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.UPDATE_FORGOT_PASSWORD}?token=${token}`,
        {
          nuevaContrasenia,
        }
      );
      return response.data;
    } catch (error) {
      // Return the error response data directly if available, to show the exact message from backend
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw new Error(
        error.response?.data?.message || "Error al actualizar contraseña"
      );
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

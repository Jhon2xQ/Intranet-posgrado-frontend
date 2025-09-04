// API Configuration
// For cross-device access, use the actual IP address instead of localhost
const getApiBaseUrl = () => {
  // Check if we have a custom API URL in environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to localhost for development
  return "http://localhost:8080/api";
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  CHANGE_PASSWORD: "/auth/password",

  // User
  ACADEMIC_INFO: "/users/academica",
  PERSONAL_INFO: "/users/personal",

  // Student
  GRADES: "/estudiante/notas",
  PAYMENTS: "/estudiante/pagos",

  // Notices
  NOTICES: "/notices/avisos",
  LINKS: "/notices/enlaces",
};

// External Links
export const EXTERNAL_LINKS = {
  CAJA_UNSAAC: "https://servicios.unsaac.edu.pe/recaudacion/",
  TRAMITE_DOCUMENTARIO: "https://tramite.unsaac.edu.pe/tramite/virtual",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USERNAME: "username",
  USER_DATA: "userData",
};

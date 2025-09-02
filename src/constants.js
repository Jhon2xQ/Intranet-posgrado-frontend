// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  CHANGE_PASSWORD: '/auth/password',
  
  // User
  ACADEMIC_INFO: '/users/academica',
  PERSONAL_INFO: '/users/personal',
  
  // Student
  GRADES: '/estudiante/notas',
  PAYMENTS: '/estudiante/pagos',
  
  // Notices
  NOTICES: '/notices/avisos',
  LINKS: '/notices/enlaces'
};

// External Links
export const EXTERNAL_LINKS = {
  CAJA_UNSAAC: 'https://caja.unsaac.edu.pe',
  TRAMITE_DOCUMENTARIO: 'https://tramite.unsaac.edu.pe'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USERNAME: 'username',
  USER_DATA: 'userData'
};

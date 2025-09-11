import api from "./api";
import { API_ENDPOINTS } from "../constants";

export const userService = {
  // Get academic information
  async getAcademicInfo() {
    try {
      const response = await api.get(API_ENDPOINTS.ACADEMIC_INFO);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener información académica",
      );
    }
  },

  // Get personal information
  async getPersonalInfo() {
    try {
      const response = await api.get(API_ENDPOINTS.PERSONAL_INFO);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener información personal",
      );
    }
  },

  // Get student grades
  async getGrades() {
    try {
      const response = await api.get(API_ENDPOINTS.GRADES);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener notas",
      );
    }
  },

  // Get student payments
  async getPayments() {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener pagos",
      );
    }
  },

  // Get notices
  async getNotices() {
    try {
      const response = await api.get(API_ENDPOINTS.NOTICES);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener avisos",
      );
    }
  },

  // Get important links
  async getLinks() {
    try {
      const response = await api.get(API_ENDPOINTS.LINKS);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener enlaces",
      );
    }
  },
};

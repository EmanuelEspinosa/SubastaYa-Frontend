import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/auth`;
/**
 * Inicia sesión de un usuario registrado.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Datos del usuario y token (AuthResponseDto)
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    // Si la API respondió con error (ej. 401 Unauthorized), lanzamos el mensaje del backend
    throw new Error(data.mensaje || "Error al iniciar sesión");
  }

  return data;
};

/**
 * Registra un nuevo usuario en la plataforma.
 * @param {Object} userData - { nombre, email, password }
 * @returns {Promise<Object>} Datos del usuario y token (AuthResponseDto)
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Si la API respondió con error (ej. 400 BadRequest), lanzamos el mensaje del backend
    throw new Error(data.mensaje || "Error al registrar el usuario");
  }

  return data;
};
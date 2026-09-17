// Lee la variable local del archivo .env.local; si no existe, usa por defecto el puerto 5120
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5120/api";
export const API_URL = API_BASE_URL;
export default API_BASE_URL;
// Lee la variable local del archivo .env.local; si no existe, usa por defecto el puerto 7000
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7000/api";
export const API_URL = API_BASE_URL;
export default API_BASE_URL;
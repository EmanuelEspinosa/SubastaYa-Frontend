import { createContext, useState, useEffect, useContext } from "react";
import { login, register } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verifica si ya hay una sesión guardada en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("subastaYa_user");
    const storedToken = localStorage.getItem("subastaYa_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función para Iniciar Sesión
  const loginUser = async (credentials) => {
    const data = await login(credentials); // data = { usuarioId, nombre, email, token }
    const { token, ...userData } = data;

    // Persistir datos en el navegador
    localStorage.setItem("subastaYa_token", token);
    localStorage.setItem("subastaYa_user", JSON.stringify(userData));

    setUser(userData);
    return data;
  };

  // Función para Registro (Auto-Login al registrarse)
  const registerUser = async (userDataDto) => {
    const data = await register(userDataDto);
    const { token, ...userData } = data;

    localStorage.setItem("subastaYa_token", token);
    localStorage.setItem("subastaYa_user", JSON.stringify(userData));

    setUser(userData);
    return data;
  };

  // Función para Cerrar Sesión
  const logoutUser = () => {
    localStorage.removeItem("subastaYa_token");
    localStorage.removeItem("subastaYa_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir la autenticación fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
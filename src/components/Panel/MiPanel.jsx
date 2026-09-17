import { useSearchParams } from "react-router-dom";
import { MisPujas } from "./Pujas/MisPujas";
import { MisPublicaciones } from "./MisPublicaciones/MisPublicaciones";
import { Billetera } from "./Billetera/Billetera";
import { CrearSubasta } from "./CrearSubasta/CrearSubasta";
import "./MiPanel.css";

export const MiPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabActual = searchParams.get("tab") || "compras";

  const cambiarTab = (nombreTab) => {
    setSearchParams({ tab: nombreTab });
  };

  return (
    <div className="panel-container">
      <h2 className="panel-title">Mi Panel de Actividades</h2>

      {/* Navegación por Pestañas */}
      <div className="panel-tabs">
        <button
          className={`tab-btn ${tabActual === "compras" ? "active" : ""}`}
          onClick={() => cambiarTab("compras")}
        >
          Mis Compras / Pujas
        </button>
        <button
          className={`tab-btn ${tabActual === "publicaciones" ? "active" : ""}`}
          onClick={() => cambiarTab("publicaciones")}
        >
          Mis Publicaciones
        </button>
        <button
          className={`tab-btn ${tabActual === "billetera" ? "active" : ""}`}
          onClick={() => cambiarTab("billetera")}
        >
          Mi Billetera
        </button>
        <button
          className={`tab-btn ${tabActual === "crear" ? "active" : ""}`}
          onClick={() => cambiarTab("crear")}
        >
          + Crear Subasta
        </button>
      </div>

      {/* Renderizado de la pestaña seleccionada */}
      <div className="panel-content">
        {tabActual === "compras" && <MisPujas />}
        {tabActual === "publicaciones" && <MisPublicaciones />}
        {tabActual === "billetera" && <Billetera />}
        {tabActual === "crear" && (
          <CrearSubasta onSuccess={() => cambiarTab("publicaciones")} />
        )}
      </div>
    </div>
  );
};
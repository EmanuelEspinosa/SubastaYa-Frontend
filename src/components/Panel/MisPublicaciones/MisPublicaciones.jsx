import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getSubastas } from "../../../services/subastaService";
import "./MisPublicaciones.css";

export const MisPublicaciones = () => {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      if (!user?.usuarioId) return;
      try {
        setLoading(true);
        // getSubastas(categoriaId, vendedorId, compradorId)
        const data = await getSubastas(null, user.usuarioId, null, null);
        setPublicaciones(data);
      } catch (err) {
        setError(err.message || "Error al obtener tus publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    cargarPublicaciones();
  }, [user]);

  if (loading) {
    return <div className="publicaciones-loading">Cargando tus publicaciones...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  if (publicaciones.length === 0) {
    return (
      <div className="publicaciones-empty">
        <p className="publicaciones-empty-text">No tenés publicaciones creadas todavía.</p>
      </div>
    );
  }

  return (
    <div className="publicaciones-module">
      <div className="table-responsive">
        <table className="table align-middle custom-table">
          <thead>
            <tr>
              <th id="th_primero">Producto</th>
              <th>Precio Base</th>
              <th>Oferta Actual</th>
              <th>Estado</th>
              <th id="th_ultimo">Acción</th>
            </tr>
          </thead>
          <tbody>
            {publicaciones.map((pub) => {
              const precioMuestra = pub.ofertaMasAltaActual ?? pub.precioBase;
              const estadoNombre = typeof pub.estado === "string" 
                ? pub.estado 
                : (pub.estado === 1 ? "Programada" : pub.estado === 2 ? "Activa" : pub.estado === 3 ? "Finalizada" :"Desierta");

              return (
                <tr key={pub.id}>
                  <td>
                    <div className="img_title">
                      {pub.urlImagen ? (
                        <img
                          src={pub.urlImagen}
                          alt={pub.titulo}
                          className="subasta-thumb"
                        />
                      ) : (
                        <div className="subasta-thumb-placeholder">
                          <span>Sin foto</span>
                        </div>
                      )}
                      <span className="subasta-titulo">{pub.titulo}</span>
                    </div>
                  </td>
                  <td className="precio_base">
                    ${pub.precioBase?.toLocaleString("es-AR")}
                  </td>
                  <td className="oferta_actual">
                    ${precioMuestra?.toLocaleString("es-AR")}
                  </td>
                  <td>
                    <span
                      className={`badge-estado ${
                        estadoNombre === "Activa" ? "activa" : estadoNombre === "Programada" ? "programada" : estadoNombre === "Finalizada" ? "finalizada" : "desierta"
                      }`}
                    >
                      {estadoNombre}
                    </span>
                  </td>
                  <td>
                    <Link to={`/subasta/${pub.id}`} className="btn-ver-subasta">
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
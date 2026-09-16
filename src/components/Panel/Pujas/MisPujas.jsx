import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getSubastas } from "../../../services/subastaService";
import "./MisPujas.css";

export const MisPujas = () => {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMisCompras = async () => {
      if (!user?.usuarioId) return;
      try {
        setLoading(true);
        // getSubastas(categoriaId, vendedorId, compradorId)
        const data = await getSubastas(null, null, user.usuarioId);
        setCompras(data);
      } catch (err) {
        setError(err.message || "Error al obtener las pujas.");
      } finally {
        setLoading(false);
      }
    };

    cargarMisCompras();
  }, [user]);

  if (loading) {
    return <div className="pujas-loading">Cargando tus compras y pujas...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  if (compras.length === 0) {
    return (
      <div className="pujas-empty">
        <p className="pujas-empty-text">Aún no participaste en ninguna subasta.</p>
        <Link to="/products" className="btn-explorar">
          Explorar Subastas
        </Link>
      </div>
    );
  }

  return (
    <div className="pujas-module">
      <div className="table-responsive">
        <table className="table align-middle custom-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Base</th>
              <th>Oferta Actual</th>
              <th>Estado</th>
              <th>Resultado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((subasta) => {
              const precioMuestra = subasta.ofertaMasAltaActual ?? subasta.precioBase;
              const estadoNombre = typeof subasta.estado === "string" 
                ? subasta.estado 
                : (subasta.estado === 2 ? "Activa" : subasta.estado === 3 ? "Finalizada" : subasta.estado === 4 ? "Desierta" : "Programada");

              return (
                <tr key={subasta.id}>
                  <td>
                    <div>
                      {subasta.urlImagen ? (
                        <img
                          src={subasta.urlImagen}
                          alt={subasta.titulo}
                          className="subasta-thumb"
                        />
                      ) : (
                        <div className="subasta-thumb-placeholder">
                          <span>Sin foto</span>
                        </div>
                      )}
                      <span className="subasta-titulo">{subasta.titulo}</span>
                    </div>
                  </td>
                  <td>
                    ${subasta.precioBase?.toLocaleString("es-AR")}
                  </td>
                  <td>
                    ${precioMuestra?.toLocaleString("es-AR")}
                  </td>
                  <td>
                    <span
                      className={`badge-estado ${
                        estadoNombre.toLowerCase() === "activa" || estadoNombre === "0"
                          ? "activa"
                          : "finalizada"
                      }`}
                    >
                      {estadoNombre}
                    </span>
                  </td>
                  <td>
                    {
                      user?.usuarioId === subasta.compradorLiderId ? (
                        <div>Ganada</div>
                      ) : (<div>Perdida</div>)
                    }
                  </td>
                  <td>
                    <Link to={`/subasta/${subasta.id}`} className="btn-ver-subasta">
                      Ver Subasta
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
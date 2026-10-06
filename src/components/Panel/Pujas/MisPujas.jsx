import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getMisPujas } from "../../../services/subastaService";
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
        const data = await getMisPujas(user.usuarioId); // GET /api/users/{id}/bids
        setCompras(Array.isArray(data) ? data : (data.items ?? []));
      } catch (err) {
        setError(err.message || "Error al obtener tus pujas.");
      } finally {
        setLoading(false);
      }
    };
    cargarMisCompras();
  }, [user]);

  if (loading) return <div className="pujas-loading">Cargando tus compras y pujas...</div>;
  if (error) return <div className="alert alert-danger my-3">{error}</div>;
  if (compras.length === 0) {
    return (
      <div className="pujas-empty">
        <p className="pujas-empty-text">Aún no participaste en ninguna subasta.</p>
        <Link to="/" className="btn-explorar">Explorar Subastas</Link>
      </div>
    );
  }

  const estadoNombre = (e) => (e === 1 ? "Programada" : e === 2 ? "Activa" : e === 3 ? "Finalizada" : "Desierta");
  const claseEstado = (e) => (e === 2 ? "activa" : e === 1 ? "programada" : e === 3 ? "finalizada" : "desierta");
  const claseResultado = (r) => ({
    Ganando: "activa_ganando", Superado: "activa_superada", Ganada: "subasta_ganada",
    Perdida: "subasta_perdida", Desierta: "badge-estado desierta", "En espera": "activa_superada"
  }[r] || "activa_superada");

  return (
    <div className="pujas-module">
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th id="th_primero">Producto</th>
              <th>Mi Última Puja</th>
              <th>Oferta Actual</th>
              <th>Estado</th>
              <th>Resultado</th>
              <th id="th_ultimo">Acción</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((p) => (
              <tr key={p.subastaId}>
                <td>
                  <div className="img_title">
                    {p.urlImagen ? (
                      <img src={p.urlImagen} alt={p.titulo} className="subasta-thumb" />
                    ) : (
                      <div className="subasta-thumb-placeholder"><span>Sin foto</span></div>
                    )}
                    <span className="subasta-titulo">{p.titulo}</span>
                  </div>
                </td>
                <td className="precio_base">${p.miUltimaPuja?.toLocaleString("es-AR")}</td>
                <td className="oferta_actual">${p.ofertaActual?.toLocaleString("es-AR")}</td>
                <td><span className={`badge-estado ${claseEstado(p.estado)}`}>{estadoNombre(p.estado)}</span></td>
                <td id="td-resultado"><span className={claseResultado(p.resultado)}>{p.resultado}</span></td>
                <td><Link to={`/subasta/${p.subastaId}`} className="btn-ver-subasta">Ver Subasta</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
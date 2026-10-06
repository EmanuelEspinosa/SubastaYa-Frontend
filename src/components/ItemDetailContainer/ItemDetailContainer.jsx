import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ItemDetail } from "../ItemDetail/ItemDetail";
import { getSubastaById, getHistorialPujas } from "../../services/subastaService";

const POLL_MS = 2500; // dentro del rango 2–3 s exigido

export const ItemDetailContainer = () => {
  const [subasta, setSubasta] = useState(null);
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const vivo = useRef(true);

  const cargarSala = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const [s, p] = await Promise.all([getSubastaById(id), getHistorialPujas(id)]);
      if (!vivo.current) return;
      setSubasta(s); setPujas(p); setError(null);
    } catch (err) {
      if (!vivo.current) return;
      if (!silencioso) setError("No se pudo cargar la subasta solicitada.");
    } finally {
      if (vivo.current && !silencioso) setLoading(false);
    }
  }, [id]);

  useEffect(() => { vivo.current = true; cargarSala(); return () => { vivo.current = false; }; }, [cargarSala]);

  // F13: refleja pujas, líder, extensión anti-sniping y estado de OTRA sesión sin recargar
  useEffect(() => {
    if (loading || error) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") cargarSala(true);
    }, POLL_MS);
    return () => clearInterval(t);
  }, [loading, error, cargarSala]);

  if (loading) return (<div className="detail-status-container"><div className="spinner"></div><p className="cargando-sala">Cargando sala de subasta en vivo...</p></div>);
  if (error || !subasta) return (<div className="detail-status-container"><h2>Subasta no encontrada</h2><p>{error || "El artículo que buscas no existe o fue retirado."}</p><Link to="/" className="btn-back">Volver al Catálogo</Link></div>);

  return (
    <main className="detail-main-wrapper">
      <ItemDetail detail={subasta} historialPujas={pujas}
        onSubastaActualizada={() => cargarSala(true)} />
    </main>
  );
};
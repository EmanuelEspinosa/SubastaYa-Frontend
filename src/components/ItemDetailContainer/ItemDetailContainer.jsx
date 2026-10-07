import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubastaById, getHistorialPujas } from "../../services/subastaService";
import { ItemDetail } from "../ItemDetail/ItemDetail";

export const ItemDetailContainer = () => {
    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

export const ItemDetailContainer = () => {
    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const vivo = useRef(true);

    // Carga o refresca la sala sin pantallazo de carga continuo
    const cargarSala = useCallback((esCargaInicial = false) => {
        if (esCargaInicial) setLoading(true);
        Promise.all([getSubastaById(id), getHistorialPujas(id)])
            .then(([subastaData, pujasData]) => {
                if (!vivo.current) return;
                setSubasta(subastaData);
                setPujas(pujasData);
                setError(null);
            })
            .catch((err) => {
                console.error("Error al refrescar la sala de subasta:", err);
                if (!vivo.current) return;
                if (esCargaInicial) setError("No se pudo cargar la subasta solicitada.");
            })
            .finally(() => {
                if (vivo.current && esCargaInicial) setLoading(false);
            });
    }, [id]);

    // 1. Carga inicial al entrar a la sala
    useEffect(() => {
        vivo.current = true;
        cargarSala(true);
        return () => { vivo.current = false; };
    }, [cargarSala]);

    // 2. POLLING F13: sincroniza pujas, líder, extensión y estado de OTRA sesión sin recargar
    useEffect(() => {
        if (loading || error) return;
        const t = setInterval(() => {
            if (document.visibilityState === "visible") cargarSala(false);
        }, POLL_MS);
        return () => clearInterval(t);
    }, [loading, error, cargarSala]);

    if (loading) {
        return (
            <div className="detail-status-container">
                <div className="spinner"></div>
                <p className="cargando-sala">Cargando sala de subasta en vivo...</p>
            </div>
        );
    }

    if (error || !subasta) {
        return (
            <div className="detail-status-container">
                <h2>Subasta no encontrada</h2>
                <p>{error || "El artículo que buscas no existe o fue retirado."}</p>
                <Link to="/" className="btn-back">Volver al Catálogo</Link>
            </div>
        );
    }

    return (
        <main className="detail-main-wrapper">
            <ItemDetail
                detail={subasta}
                historialPujas={pujas}
                onSubastaActualizada={() => cargarSala(false)}
            />
        </main>
    );
};
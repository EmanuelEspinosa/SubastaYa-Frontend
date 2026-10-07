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

    const cargarDatosSala = useCallback((esCargaInicial = false) => {
        if (esCargaInicial) setLoading(true);

        Promise.all([getSubastaById(id), getHistorialPujas(id)])
            .then(([subastaData, pujasData]) => {
                setSubasta(subastaData);
                setPujas(pujasData);
                setError(null);
            })
            .catch((err) => {
                console.error("Error al refrescar la sala de subasta:", err);
                if (esCargaInicial) {
                    setError("No se pudo cargar la subasta solicitada.");
                }
            })
            .finally(() => {
                if (esCargaInicial) setLoading(false);
            });
    }, [id]);

    // 1. Carga inicial al entrar
    useEffect(() => {
        cargarDatosSala(true);
    }, [cargarDatosSala]);

    // 2. POLLING / SINCRONIZACIÓN EN TIEMPO REAL (Resuelve F13)
    // Consulta al servidor cada 2 segundos para sincronizar ofertas de otros compradores en vivo
    useEffect(() => {
        if (!id) return;

        const interval = setInterval(() => {
            cargarDatosSala(false);
        }, 2000); // 2 segundos

        return () => clearInterval(interval);
    }, [id, cargarDatosSala]);

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
                onSubastaActualizada={() => cargarDatosSala(false)}
            />
        </main>
    );
};
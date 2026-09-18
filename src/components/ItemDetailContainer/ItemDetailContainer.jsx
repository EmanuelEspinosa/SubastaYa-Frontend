import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ItemDetail } from "../ItemDetail/ItemDetail";
import { getSubastaById, getHistorialPujas } from "../../services/subastaService";

export const ItemDetailContainer = () => {
    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        Promise.all([getSubastaById(id), getHistorialPujas(id)])
            .then(([subastaData, pujasData]) => {
                setSubasta(subastaData);
                setPujas(pujasData);
                setError(null);
            })
            .catch((err) => {
                console.error("Error al cargar la sala de subasta:", err);
                setError("No se pudo cargar la subasta solicitada.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

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
            <ItemDetail detail={subasta} historialPujas={pujas} />
        </main>
    );
};
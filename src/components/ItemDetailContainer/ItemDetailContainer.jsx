import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubastaById, getHistorialPujas } from "../../services/subastaService";
import { ItemDetail } from "../ItemDetail/ItemDetail";

const POLL_MS = 2500; // dentro del rango 2–3 s exigido

    // Función memorizada para actualizar la sala sin mostrar pantalla de carga continua
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
            <ItemDetail 
                detail={subasta} 
                historialPujas={pujas} 
                onSubastaActualizada={() => cargarDatosSala(false)}
            />
        </main>
    );
};
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./Item.css";

export const Item = ({
    id,
    titulo,
    descripcion,
    urlImagen,
    categoriaNombre,
    vendedorNombre,
    ofertaMasAltaActual,
    precioBase,
    cantidadOfertas,
    estado,
    fechaFin
}) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const getEstadoInfo = (estadoNum) => {
        switch (estadoNum) {
            case 1:
                return { texto: "Programada", clase: "estado-programada" };
            case 2:
                return { texto: "Activa", clase: "estado-activa" };
            case 3:
                return { texto: "Finalizada", clase: "estado-finalizada" };
            default:
                return { texto: "Desierta", clase: "estado-desierta" };
        }
    };

    const { texto: estadoTexto, clase: estadoClase } = getEstadoInfo(estado);

    const [timeLeft, setTimeLeft] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
        isCritical: false,
        isEnded: false
    });

    const parseUtcDate = (dateStr) => {
        if (!dateStr) return null;
        return (dateStr.endsWith("Z") || dateStr.includes("+"))
            ? new Date(dateStr)
            : new Date(`${dateStr}Z`);
    };

    useEffect(() => {
        if (estado !== 2 || !fechaFin) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();              // Momento actual
            const target = parseUtcDate(fechaFin)?.getTime();   // Fecha fin enviada por la API
            const difference = target - now;               // Milisegundos restantes

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00", isCritical: false, isEnded: true });
            } else {
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const m = Math.floor((difference / 1000 / 60) % 60);
                const s = Math.floor((difference / 1000) % 60);

                // Guarda los valores formateados en el estado
                setTimeLeft({
                    hours: h < 10 ? `0${h}` : `${h}`,
                    minutes: m < 10 ? `0${m}` : `${m}`,
                    seconds: s < 10 ? `0${s}` : `${s}`,
                    isCritical: Math.floor(difference / 1000) <= 120, // Parpadea si quedan <= 2 min
                    isEnded: false
                });
            }
        }, 1000);

        return () => clearInterval(interval); // Limpieza de memoria
    }, [fechaFin, estado]);

    return (
        <article className="cardProduct">
            <div className="product-img">
                <img src={urlImagen || "/images/placeholder.png"} alt={titulo} />
                <span className={`status-badge ${estadoClase}`}>
                    {estadoTexto}
                </span>
                {estado === 2 && !timeLeft.isEnded && (
                    <div className={`timer-banner timer-banner-item ${timeLeft.isCritical ? "timer-critical" : ""}`}>
                        <span>
                            Tiempo Restante: {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                        </span>
                    </div>
                )}
            </div>

            <div className="product-info">
                <h2 className="product-name">{titulo}</h2>
                <p className="brand">Vendedor: {vendedorNombre || "Anónimo"}</p>
                <p className="category">{categoriaNombre}</p>

                {descripcion && (
                    <p className="feature">
                        {descripcion.length > 80 ? `${descripcion.slice(0, 80)}...` : descripcion}
                    </p>
                )}

                <div className="section-precio">
                    <div className="section-priceReal">
                        <span className="price-label">
                            {cantidadOfertas > 0 ? "Oferta actual:" : "Precio base:"}
                        </span>
                        <div className="price-tag">
                            {formatCurrency(ofertaMasAltaActual || precioBase)}
                        </div>
                    </div>
                    <div className="bids-count">
                        {cantidadOfertas} {cantidadOfertas === 1 ? "oferta" : "ofertas"}
                    </div>
                </div>

                <Link to={`/subasta/${id}`} className="detail-button">
                    {estado === 2 ? "Ingresar y Ofertar" : "Ver Detalle"}
                </Link>
            </div>
        </article>
    );
};
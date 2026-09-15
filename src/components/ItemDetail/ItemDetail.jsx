import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faLock,
    faShieldHalved,
    faClock,
    faGavel,
    faUserCheck,
    faExclamationTriangle,
    faHistory,
    faWallet,
    faBan
} from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "../../layout/ConfirmModal/ConfirmModal";
import "./ItemDetail.css";

export const ItemDetail = ({ detail, historialPujas = [] }) => {
    const {
        id,
        titulo,
        descripcion,
        urlImagen,
        categoriaNombre,
        vendedorNombre,
        ofertaMasAltaActual,
        precioBase,
        incrementoMinimo = 1000,
        cantidadOfertas = 0,
        estado, // Enum: 1=Programada, 2=Activa, 3=Finalizada, 4=Desierta
        fechaInicio,
        fechaFin,
        esMiOfertaLaMasAlta = false
    } = detail;

    const estadoNum = Number(estado) || 1;

    // Historial de ofertas
    const ofertasList = historialPujas.length > 0
        ? historialPujas
        : (detail.historialOfertas || detail.ofertas || detail.pujas || detail.bids || []);

    const precioActual = ofertaMasAltaActual || precioBase;
    const pujaMinimaSugerida = precioActual + incrementoMinimo;

    const [montoOferta, setMontoOferta] = useState(pujaMinimaSugerida);
    const [showModal, setShowModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cuenta regresiva (solo activa si estado === 2)
    const [timeLeft, setTimeLeft] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
        isCritical: false,
        isEnded: estadoNum === 3 || estadoNum === 4
    });

    useEffect(() => {
        if (estadoNum !== 2 || !fechaFin) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(fechaFin).getTime();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00", isCritical: false, isEnded: true });
            } else {
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const m = Math.floor((difference / 1000 / 60) % 60);
                const s = Math.floor((difference / 1000) % 60);
                const totalSecondsLeft = Math.floor(difference / 1000);

                setTimeLeft({
                    hours: h < 10 ? `0${h}` : `${h}`,
                    minutes: m < 10 ? `0${m}` : `${m}`,
                    seconds: s < 10 ? `0${s}` : `${s}`,
                    isCritical: totalSecondsLeft <= 120,
                    isEnded: false
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [fechaFin, estadoNum]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const handleQuickAdd = (extra) => {
        setMontoOferta((prev) => Number(prev) + extra);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (Number(montoOferta) < pujaMinimaSugerida) {
            alert(`Tu oferta debe ser de al menos ${formatCurrency(pujaMinimaSugerida)}`);
            return;
        }
        setShowModal(true);
    };

    const handleConfirmBid = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setConfirmMessage(`¡Oferta realizada con éxito por ${formatCurrency(montoOferta)}!`);
            setIsSubmitting(false);
            setTimeout(() => {
                setShowModal(false);
                setConfirmMessage("");
            }, 2500);
        }, 1000);
    };

    // Función auxiliar para texto del Badge de Estado
    const getBadgeText = (st) => {
        switch (st) {
            case 1: return "Próximamente";
            case 2: return "🔴 Subasta en Vivo";
            case 3: return "Finalizada";
            case 4: return "Desierta";
            default: return "Próximamente";
        }
    };

    return (
        <section className="item-detail">
            <Link className="icono-cierreCard" to="/">
                <FontAwesomeIcon icon={faTimes} size="2x" />
            </Link>

            {/* COLUMNA 1: IMAGEN Y DESCRIPCIÓN */}
            <div className="columna1">
                <div className="titulo">
                    <h3>Categoria : {categoriaNombre}</h3>
                    <h2>{titulo}</h2>
                </div>
                <div className="item-detail__image">
                    <img src={urlImagen || "/images/placeholder.png"} alt={titulo} />
                    <div className={`status-badge-detail estado-${estadoNum}`}>
                        {getBadgeText(estadoNum)}
                    </div>
                </div>
                <div className="description-section">
                    <h3>Descripción del Artículo</h3>
                    <p className="item-detail__feature">{descripcion}</p>
                </div>
            </div>

            {/* COLUMNA 2: INFORMACIÓN PRINCIPAL Y CONSOLA */}
            <div className="product-price-pay">
                <h3 className="product-price__vendedor">Vendedor: {vendedorNombre || "Anónimo"}</h3>
                
                {/* TEMPORIZADOR SEGÚN CADA ESTADO */}
                {estadoNum === 1 && (
                    <div className="timer-banner timer-upcoming">
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                            {fechaInicio && new Date(fechaInicio) > new Date()
                                ? `Inicio programado: ${new Date(fechaInicio).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })} hs`
                                : "Subasta Programada"}
                        </span>
                    </div>
                )}

                {estadoNum === 2 && !timeLeft.isEnded && (
                    <div className={`timer-banner ${timeLeft.isCritical ? "timer-critical" : ""}`}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                            Tiempo Restante: {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                        </span>
                    </div>
                )}

                {estadoNum === 3 && (
                    <div className="timer-banner timer-ended">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Subasta Finalizada - Con Ganador</span>
                    </div>
                )}

                {(estadoNum === 4 || (estadoNum === 2 && timeLeft.isEnded)) && (
                    <div className="timer-banner timer-deserted">
                        <FontAwesomeIcon icon={faBan} />
                        <span>Subasta Desierta - Sin Ofertas</span>
                    </div>
                )}

                <div className="container-price">
                    

                    <div className="price-main">
                        <span className="price-label">
                            {cantidadOfertas > 0 ? "Oferta Más Alta Actual:" : "Precio Base de Salida:"}
                        </span>
                        <p className="item-detail__price">{formatCurrency(precioActual)}</p>
                    </div>

                    {estadoNum === 2 && (
                        <div className={`leader-badge ${esMiOfertaLaMasAlta ? "badge-leading" : "badge-outbid"}`}>
                            <FontAwesomeIcon icon={esMiOfertaLaMasAlta ? faUserCheck : faExclamationTriangle} />
                            <span>{esMiOfertaLaMasAlta ? "¡Vas Liderando!" : "Fuiste Superado"}</span>
                        </div>
                    )}
                </div>

                {estadoNum === 2 && !timeLeft.isEnded ? (
                    <form onSubmit={handleFormSubmit} className="bidding-console">
                        <label>
                            Tu Oferta Directa (Mínimo: <strong>{formatCurrency(pujaMinimaSugerida)}</strong>):
                        </label>
                        <div className="bidding-input-group">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                value={montoOferta}
                                min={pujaMinimaSugerida}
                                onChange={(e) => setMontoOferta(Number(e.target.value))}
                                required
                            />
                            <button type="submit" className="btn-bid-submit">
                                <FontAwesomeIcon icon={faGavel} /> Realizar Puja
                            </button>
                        </div>

                        <div className="quick-bids">
                            <span>Suma rápida:</span>
                            <button type="button" onClick={() => handleQuickAdd(incrementoMinimo)}>
                                +{formatCurrency(incrementoMinimo)}
                            </button>
                            <button type="button" onClick={() => handleQuickAdd(5000)}>+$5.000</button>
                            <button type="button" onClick={() => handleQuickAdd(10000)}>+$10.000</button>
                        </div>
                    </form>
                ) : (
                    <div className="closed-auction-notice">
                        <FontAwesomeIcon icon={estadoNum === 4 ? faBan : faLock} size="2x" />
                        <p>
                            {estadoNum === 1 && "Esta subasta aún no ha comenzado."}
                            {estadoNum === 3 && "Esta subasta ya finalizó. No se aceptan más ofertas."}
                            {estadoNum === 4 && "Esta subasta finalizó sin ofertas recibidas (Desierta)."}
                            {estadoNum === 2 && timeLeft.isEnded && "El tiempo reglamentario ha concluido."}
                        </p>
                    </div>
                )}

                <div className="bids-history-section">
                    <h4>
                        <FontAwesomeIcon icon={faHistory} /> Historial de Ofertas ({ofertasList.length || cantidadOfertas})
                    </h4>
                    {ofertasList.length > 0 ? (
                        <ul className="bids-list">
                            {ofertasList.map((bid, index) => (
                                <li key={bid.id || index} className={index === 0 ? "top-bid" : ""}>
                                    <div className="bid-info-main">
                                        <span className="bid-user">
                                            {bid.compradorSeudonimo || bid.usuarioPseudonimo || `Comprador #${bid.compradorId || index + 1}`}
                                        </span>
                                        <span className="bid-amount">{formatCurrency(bid.monto)}</span>
                                    </div>
                                    <span className="bid-time">
                                        {bid.fechaPuja || bid.fechaHora
                                            ? new Date(bid.fechaPuja || bid.fechaHora).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
                                            : "Reciente"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-bids-text">Aún no hay ofertas registradas.</p>
                    )}
                </div>
            </div>

            {/* COLUMNA 3: HISTORIAL Y GARANTÍAS */}
            <div className="product-information">
                <div className="logo-empresa">
                    <img src="../../public/images/Logo/iconoEmpresa2.jpg"/>
                </div>
                <div className="info-pay">
                    <div className="info-pay_item">
                        <FontAwesomeIcon icon={faLock} className="icon-info-pay" />
                        <div>
                            <h4>Pujas Auditadas y Seguras</h4>
                            <p>Tus fondos quedan retenidos temporalmente en tu Billetera Virtual.</p>
                        </div>
                    </div>
                    <div className="info-pay_item">
                        <FontAwesomeIcon icon={faWallet} className="icon-info-pay" />
                        <div>
                            <h4>Retiro Inmediato de Fondos</h4>
                            <p>Si alguien supera tu oferta, tu dinero se libera al instante.</p>
                        </div>
                    </div>
                    <div className="info-pay_item">
                        <FontAwesomeIcon icon={faShieldHalved} className="icon-info-pay" />
                        <div>
                            <h4>Garantía Anti-Sniping</h4>
                            <p>Las ofertas en el último minuto extienden el temporizador 2 minutos más.</p>
                        </div>
                    </div>
                </div>

                <div className="share-product">
                    <h3>Comparte esta subasta</h3>
                    <div className="share-product-imgRedes">
                        <Link className="item-share" to="https://facebook.com" target="_blank">
                            <img src="../../images/RedesSociales/Facebook.png" alt="Facebook" />
                        </Link>
                        <Link className="item-share" to="https://instagram.com" target="_blank">
                            <img src="../../images/RedesSociales/Instagram.png" alt="Instagram" />
                        </Link>
                        <Link className="item-share" to="https://twitter.com" target="_blank">
                            <img src="../../images/RedesSociales/Twitter-nuevo.png" alt="Twitter" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* MODAL REUTILIZABLE DE CONFIRMACIÓN */}
            {showModal && (
                <ConfirmModal
                    title="Confirmar Puja en Vivo"
                    prompt={`Estás a punto de realizar una oferta por ${formatCurrency(montoOferta)} en "${titulo}".`}
                    message={confirmMessage}
                    onConfirm={handleConfirmBid}
                    onCancel={() => setShowModal(false)}
                    isSubmitting={isSubmitting}
                />
            )}
        </section>
    );
};
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

import { useAuth } from "../../context/AuthContext";
import { realizarPuja } from "../../services/subastaService";
import { ConfirmModal } from "../../layout/ConfirmModal/ConfirmModal";
import "./ItemDetail.css";

export const ItemDetail = ({ detail, historialPujas = [], onSubastaActualizada }) => {
    const { user } = useAuth();

    // Mapeo directo del SubastaDto enviado por la API
    const {
        id,
        vendedorNombre,
        categoriaNombre,
        titulo,
        descripcion,
        urlImagen,
        precioBase = 0,
        incrementoMinimo = 1000,
        compradorLiderId,
        ofertaMasAltaActual,
        cantidadOfertas = 0,
        fechaInicio,
        fechaFin,
        estado
    } = detail;

    // const estadoNum = Number(estado) || 1;
    const precioActual = cantidadOfertas > 0 ? ofertaMasAltaActual : precioBase;
    const pujaMinimaSugerida = precioActual + incrementoMinimo;

    // Evaluación directa usando CompradorLiderId del DTO
    const esMiOfertaLaMasAlta = user?.usuarioId && Number(compradorLiderId) === Number(user.usuarioId);
    const haOfertadoElUsuario = historialPujas.some(bid => Number(bid.compradorId) === Number(user?.usuarioId));

    const [montoOferta, setMontoOferta] = useState(pujaMinimaSugerida);
    const [showModal, setShowModal] = useState(false);
    const [modalSuccessMsg, setModalSuccessMsg] = useState(null);
    const [modalErrorMsg, setModalErrorMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Actualiza el monto cuando cambia el precio actual
    useEffect(() => {
        setMontoOferta(pujaMinimaSugerida);
    }, [precioActual, incrementoMinimo]);

    // Temporizador
    const [timeLeft, setTimeLeft] = useState({
        hours: "00", minutes: "00", seconds: "00", isCritical: false, isEnded: estado === 3 || estado === 4
    });

    useEffect(() => {
        if (estado !== 2 || !fechaFin) return;

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
    }, [fechaFin, estado]);

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
        setModalSuccessMsg(null);
        setModalErrorMsg(null);
        setShowModal(true);
    };

    const handleConfirmBid = async () => {
        setIsSubmitting(true);
        setModalSuccessMsg(null);
        setModalErrorMsg(null);

        try {
            const payload = {
                subastaId: Number(id),
                compradorId: Number(user?.usuarioId),
                monto: Number(montoOferta)
            };

            const resultado = await realizarPuja(id, payload);

            let msgExito = resultado.mensaje || `¡Oferta realizada con éxito por ${formatCurrency(montoOferta)}!`;
            if (resultado.tiempoExtendido) {
                msgExito += " ⏱️ ¡Se activó la garantía Anti-Sniping y el tiempo fue extendido!";
            }

            setModalSuccessMsg(msgExito);

            setTimeout(() => {
                setShowModal(false);
                setModalSuccessMsg(null);
                if (typeof onSubastaActualizada === "function") {
                    onSubastaActualizada();
                } else {
                    window.location.reload();
                }
            }, 2500);

        } catch (err) {
            setModalErrorMsg(err.message || "Error al procesar la oferta.");

            setTimeout(() => {
                setShowModal(false);
                setModalErrorMsg(null);
            }, 2500);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h3>Categoría: {categoriaNombre}</h3>
                    <h2>{titulo}</h2>
                </div>
                <div className="item-detail__image">
                    <img src={urlImagen || "/images/placeholder.png"} alt={titulo} />
                    <div className={`status-badge-detail estado-${estado}`}>
                        {getBadgeText(estado)}
                    </div>
                </div>
                <div className="description-section">
                    <h3>Descripción del Artículo</h3>
                    <p className="item-detail__feature">{descripcion}</p>
                </div>
            </div>

            {/* COLUMNA 2: INFORMACIÓN PRINCIPAL Y CONSOLA */}
            <div className="product-price-pay">
                <h3 className="product-price__vendedor">Vendedor: {vendedorNombre}</h3>

                {estado === 1 && (
                    <div className="timer-banner timer-upcoming">
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                            {fechaInicio && new Date(fechaInicio) > new Date()
                                ? `Inicio programado: ${new Date(fechaInicio).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })} hs`
                                : "Subasta Programada"}
                        </span>
                    </div>
                )}

                {estado === 2 && !timeLeft.isEnded && (
                    <div className={`timer-banner ${timeLeft.isCritical ? "timer-critical" : ""}`}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                            Tiempo Restante: {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                        </span>
                    </div>
                )}

                {estado === 3 && (
                    <div className="timer-banner timer-ended">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Subasta Finalizada - Con Ganador</span>
                    </div>
                )}

                {(estado === 4 || (estado === 2 && timeLeft.isEnded)) && (
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

                    {/* Cartel directo respaldado por CompradorLiderId */}
                    {user?.usuarioId && estado === 2 && cantidadOfertas > 0 ? (
                        user?.usuarioId === compradorLiderId ? (
                            <div className="badge-leading">
                                <FontAwesomeIcon icon={faUserCheck} />
                                <span>Vas Liderando</span>
                            </div>
                        ) : (
                            <div className="badge-outbid">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                <span> Fuiste Superado</span>
                            </div>
                        )
                    ) : null}
                </div>

                {estado === 2 && !timeLeft.isEnded ? (
                    user?.usuarioId ? (
                        <form onSubmit={handleFormSubmit} className="bidding-console">
                            <label>
                                Tu Oferta Directa (Mínimo: <strong>{formatCurrency(pujaMinimaSugerida)}</strong>):
                            </label>
                            <div className="bidding-input-group">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    value={montoOferta}
                                    
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
                        <div className="closed-auction-notice solicitud-login">
                            <FontAwesomeIcon className="icono-secion"  icon={faLock} size="2x" />
                            <p>Debes <Link to="/login" className="link-secion">iniciar sesión</Link> para realizar una oferta.</p>
                        </div>
                    )
                ) : (
                    <div className="closed-auction-notice">
                        <FontAwesomeIcon icon={estado === 4 ? faBan : faLock} size="2x" />
                        <p>
                            {estado === 1 && "Esta subasta aún no ha comenzado."}
                            {estado === 3 && "Esta subasta ya finalizó. No se aceptan más ofertas."}
                            {estado === 4 && "Esta subasta finalizó sin ofertas recibidas (Desierta)."}
                            {estado === 2 && timeLeft.isEnded && "El tiempo reglamentario ha concluido."}
                        </p>
                    </div>
                )}

                <div className="bids-history-section">
                    <h4>
                        <FontAwesomeIcon icon={faHistory} /> Historial de Ofertas ({historialPujas.length})
                    </h4>
                    {historialPujas.length > 0 ? (
                        <ul className="bids-list">
                            {historialPujas.map((bid, index) => (
                                <li key={bid.id || index} className={index === 0 ? "top-bid" : ""}>
                                    <div className="bid-info-main">
                                        <span className="bid-user">
                                            {bid.compradorSeudonimo || `Comprador #${bid.compradorId}`}
                                        </span>
                                        <span className="bid-amount">{formatCurrency(bid.monto)}</span>
                                    </div>
                                    <span className="bid-time">
                                        {bid.fechaPuja
                                            ? new Date(bid.fechaPuja).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
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

            {/* COLUMNA 3: GARANTÍAS Y REDES */}
            <div className="product-information">
                <div className="logo-empresa">
                    <img src="/images/Logo/iconoEmpresa2.jpg" alt="SubastaYa Logo" />
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
                            <img src="/images/RedesSociales/Facebook.png" alt="Facebook" />
                        </Link>
                        <Link className="item-share" to="https://instagram.com" target="_blank">
                            <img src="/images/RedesSociales/Instagram.png" alt="Instagram" />
                        </Link>
                        <Link className="item-share" to="https://twitter.com" target="_blank">
                            <img src="/images/RedesSociales/Twitter-nuevo.png" alt="Twitter" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* MODAL REUTILIZABLE */}
            {showModal && (
                <ConfirmModal
                    title={
                        modalErrorMsg
                            ? "Error en la Oferta"
                            : modalSuccessMsg
                                ? "¡Oferta Aceptada!"
                                : "Confirmar Puja en Vivo"
                    }
                    prompt={`Estás a punto de realizar una oferta por ${formatCurrency(montoOferta)} en "${titulo}".`}
                    warningText="Se debitará el dinero de tu Billetera Virtual de forma segura."
                    confirmText="Confirmar Oferta"
                    message={modalSuccessMsg}
                    errorMessage={modalErrorMsg}
                    onConfirm={handleConfirmBid}
                    onCancel={() => setShowModal(false)}
                    isSubmitting={isSubmitting}
                />
            )}
        </section>
    );
};
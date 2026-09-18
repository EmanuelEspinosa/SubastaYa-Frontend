import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGavel,
    faShieldHalved,
    faWallet,
    faClock,
    faUsers,
    faHandshake
} from "@fortawesome/free-solid-svg-icons";
import "./AboutUs.css";

export const AboutUs = () => {
    return (
        <div className="aboutUs-container">
            {/* HEROBANNER DE ENCABEZADO */}
            <div className="aboutUs-hero">
                <span className="aboutUs-badge">
                    <FontAwesomeIcon icon={faGavel} /> Subastas Transparentes y Seguras
                </span>
                <h1 className="title-aboutUs">Sobre Subasta<span>YA</span></h1>
                <p className="subtitle-aboutUs">
                    Democratizamos el comercio en vivo conectando a compradores y vendedores a través de pujas dinámicas, auditadas y 100% confiables.
                </p>
            </div>

            {/* SECCIÓN PRINCIPAL DE PILARES */}
            <div className="aboutUs-sections">
                <section className="aboutUs-card">
                    <div className="item texto">
                        <h2>Una nueva forma de comprar y vender</h2>
                        <p className="parrafo-valores">
                            En <strong>SubastaYA</strong> nacimos con la convicción de que el valor real de los productos lo define la oferta y la demanda de forma abierta. Eliminamos intermediarios innecesarios para brindar un entorno donde cada usuario puede publicar o pujar con absoluta claridad.
                        </p>
                        <h2>Tecnología al servicio de la transparencia</h2>
                        <p>
                            Nuestra plataforma integra validación en tiempo real, garantizando que cada oferta registrada sea legítima y visible al instante para todos los participantes de la sala.
                        </p>
                    </div>
                    <div className="item visual-box">
                        <FontAwesomeIcon icon={faGavel} className="big-icon" />
                        <h3>Pujas en Vivo</h3>
                        <p>Competencia justa en tiempo real para todos los participantes.</p>
                    </div>
                </section>

                <section className="aboutUs-card reverse">
                    <div className="item visual-box highlight">
                        <FontAwesomeIcon icon={faShieldHalved} className="big-icon" />
                        <h3>Sistema Escrow</h3>
                        <p>Tus fondos están protegidos hasta la finalización de la subasta.</p>
                    </div>
                    <div className="item texto">
                        <h2>Seguridad y confianza en cada transacción</h2>
                        <p className="parrafo-valores">
                            La tranquilidad de nuestros usuarios es nuestra máxima prioridad. Implementamos un sistema de <strong>Billetera Virtual con retención de fondos (Escrow)</strong>: tu dinero permanece resguardado de forma segura y solo se efectiviza si ganás la subasta.
                        </p>
                        <h2>Reembolso inmediato de ofertas</h2>
                        <p>
                            Si alguien supera tu puja, el dinero retenido vuelve al instante a tu saldo disponible para que puedas seguir participando sin demoras ni trámites complejos.
                        </p>
                    </div>
                </section>

                <section className="aboutUs-card">
                    <div className="item texto">
                        <h2>Reglas de juego justas (Anti-Sniping)</h2>
                        <p className="parrafo-valores">
                            Para evitar que ofertas de último segundo arruinen la experiencia, contamos con la <strong>Garantía Anti-Sniping</strong>. Si se realiza una oferta en los minutos finales, el temporizador se extiende automáticamente para darles a todos la oportunidad de responder.
                        </p>
                        <h2>Comunidad comprometida</h2>
                        <p>
                            Acompañamos tanto al comprador que busca una oportunidad única como al vendedor que desea liquidar sus artículos al precio más justo del mercado.
                        </p>
                    </div>
                    <div className="item visual-box">
                        <FontAwesomeIcon icon={faUsers} className="big-icon" />
                        <h3>Red de Confianza</h3>
                        <p>Calificaciones y perfiles verificados para operar con tranquilidad.</p>
                    </div>
                </section>
            </div>

            {/* SECCIÓN INFERIOR DE SERVICIOS / VALORES */}
            <div className="aboutUs-Servis">
                <h2>¿Por qué elegir SubastaYA?</h2>
                <div className="aboutUs-Servis-container">
                    <section className="aboutUs-servis-section">
                        <div className="icon-servis-wrapper">
                            <FontAwesomeIcon icon={faWallet} />
                        </div>
                        <h4>Billetera Virtual Segura</h4>
                        <p>
                            Gestión transparente de tus saldos. Retención automática en pujas y liberación inmediata cuando eres superado.
                        </p>
                    </section>

                    <section className="aboutUs-servis-section">
                        <div className="icon-servis-wrapper">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <h4>Control Anti-Sniping</h4>
                        <p>
                            Protección contra bots y pujas de último segundo. Si hay ofertas sobre la hora, el tiempo se extiende automáticamente.
                        </p>
                    </section>

                    <section className="aboutUs-servis-section">
                        <div className="icon-servis-wrapper">
                            <FontAwesomeIcon icon={faHandshake} />
                        </div>
                        <h4>Soporte y Garantía</h4>
                        <p>
                            Acompañamiento activo ante cualquier inconveniente técnico o duda sobre el cobro y la entrega de productos.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "../../layout/ConfirmModal/ConfirmModal";
import "./Newsletter.css";

export const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setShowModal(true);
        setEmail("");

        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    return (
        <section className="section-newsletter">
            <div className="newsletter-content">
                <div className="newsletter-icon">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <h2>No te pierdas ninguna subasta</h2>
                <p>
                    Suscribite a nuestras alertas para recibir avisos de subastas a punto de cerrar, 
                    lotes exclusivos y lanzamientos de nuevos remates antes que nadie.
                </p>

                <form onSubmit={handleSubscribe} className="newsletter-form">
                    <div className="newsletter-input-group">
                        <input
                            type="email"
                            placeholder="Ingresá tu correo electrónico..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-email"
                            required
                        />
                        <button type="submit" className="btn-newsletter">
                            <FontAwesomeIcon icon={faPaperPlane} /> Suscribirme
                        </button>
                    </div>
                </form>

                {showModal && (
                    <ConfirmModal
                        message={"¡Te suscribiste con éxito! Te avisaremos cuando abran los mejores remates."}
                    />
                )}
            </div>
        </section>
    );
};
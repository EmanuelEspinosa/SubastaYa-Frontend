import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getSaldo, cargarSaldo } from "../../../services/walletService";
import { ConfirmModal } from "../../../layout/ConfirmModal/ConfirmModal";
import "./Billetera.css";

export const Billetera = () => {
  const { user } = useAuth();

  const [billetera, setBilletera] = useState({
    saldoTotal: 0,
    saldoRetenido: 0,
    saldoDisponible: 0,
  });
  const [montoRecarga, setMontoRecarga] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados para la Modal y Feedback
  const [showModal, setShowModal] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState(null);
  const [modalErrorMsg, setModalErrorMsg] = useState(null);

  const cargarDatos = async () => {
    if (!user?.usuarioId) return;
    try {
      const data = await getSaldo(user.usuarioId);
      setBilletera(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setModalSuccessMsg(null);
    setModalErrorMsg(null);
    setShowModal(true);
  };

  const handleConfirmarRecarga = async () => {
    setSubmitting(true);
    setModalSuccessMsg(null);
    setModalErrorMsg(null);

    try {
      await cargarSaldo(user.usuarioId, montoRecarga);
      
      const msgExito = `¡Transacción realizada con éxito! Se acreditaron $${Number(montoRecarga).toLocaleString("es-AR")}.`;
      setModalSuccessMsg(msgExito);
      setMontoRecarga("");
      await cargarDatos();

      // Cierra la modal tras 2.5 segundos
      setTimeout(() => {
        setShowModal(false);
        setModalSuccessMsg(null);
      }, 2500);

    } catch (err) {
      // Muestra la excepción de .NET dentro de la misma modal
      setModalErrorMsg(err.message);

      // Cierra la modal tras 2.5 segundos
      setTimeout(() => {
        setShowModal(false);
        setModalErrorMsg(null);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading_wallet">Cargando estado de cuenta...</div>;
  }

  return (
    <div className="billetera-module">
      {/* Desglose de saldos */}
      <div className="saldos-wallet">
        <div className="saldo-card">
          <span className="saldo-label">Disponible</span>
          <h4 className="saldo-monto disponible">
            ${billetera.saldoDisponible.toLocaleString("es-AR")}
          </h4>
        </div>

        <div className="saldo-card">
          <span className="saldo-label">Retenido (Pujas)</span>
          <h4 className="saldo-monto retenido">
            ${billetera.saldoRetenido.toLocaleString("es-AR")}
          </h4>
        </div>

        <div className="saldo-card">
          <span className="saldo-label">Saldo Total</span>
          <h4 className="saldo-monto total">
            ${billetera.saldoTotal.toLocaleString("es-AR")}
          </h4>
        </div>
      </div>

      {/* Formulario de recarga */}
      <div className="recarga-card">
        <h4 className="recarga-title">Recargar Saldo</h4>

        <form onSubmit={handleOpenModal}>
          <div className="form-group-wallet">
            <label className="form-label-wallet">Monto a cargar ($)</label>
            <input
              type="number"
              className="recarga-input"
              placeholder="Ej: 5000"
              value={montoRecarga}
              onChange={(e) => setMontoRecarga(e.target.value)}
              required
            />
          </div>

          <div className="montos-rapidos">
            <span className="montos-label">Montos sugeridos:</span>
            <div className="montos-chips">
              {[1000, 5000, 10000, 20000].map((monto) => (
                <button
                  key={monto}
                  type="button"
                  className="chip-btn"
                  onClick={() => setMontoRecarga(monto)}
                >
                  +${monto.toLocaleString("es-AR")}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-wallet">
            <label className="form-label-wallet">Medio de pago</label>
            <select className="recarga-input select-wallet" defaultValue="tarjeta">
              <option value="tarjeta">💳 Tarjeta de Débito / Crédito</option>
              <option value="mercadopago">🟦 Mercado Pago</option>
              <option value="transferencia">🏦 Transferencia Bancaria</option>
            </select>
          </div>

          <button type="submit" className="recarga-btn" disabled={submitting}>
            {submitting ? "Acreditando..." : "Confirmar Recarga"}
          </button>
        </form>

        <p className="recarga-info">
          🔒 Acreditación inmediata para participar en subastas activas.
        </p>
      </div>

      {/* Modal centralizada */}
      {showModal && (
        <ConfirmModal
          title={modalErrorMsg ? "Error en la Recarga" : modalSuccessMsg ? "Recarga Exitosa" : "Confirmar Recarga"}
          prompt={`¿Estás seguro de cargar $${Number(montoRecarga || 0).toLocaleString("es-AR")} en tu Billetera Virtual?`}
          warningText="El saldo estará disponible de forma inmediata en tu cuenta."
          confirmText="Confirmar Recarga"
          message={modalSuccessMsg}
          errorMessage={modalErrorMsg}
          onConfirm={handleConfirmarRecarga}
          onCancel={() => setShowModal(false)}
          isSubmitting={submitting}
        />
      )}
    </div>
  );
};
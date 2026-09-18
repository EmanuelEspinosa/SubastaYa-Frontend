// src/components/Panel/Billetera/Billetera.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
// 1. IMPORTANTE: Agregamos getHistorialTransacciones a la importación
import { getSaldo, cargarSaldo, getHistorialTransacciones } from "../../../services/walletService";
import { ConfirmModal } from "../../../layout/ConfirmModal/ConfirmModal";
import "./Billetera.css";

export const Billetera = () => {
  const { user } = useAuth();

  // ===== ESTADOS EXISTENTES =====
  const [billetera, setBilletera] = useState({
    saldoTotal: 0,
    saldoRetenido: 0,
    saldoDisponible: 0,
  });
  const [montoRecarga, setMontoRecarga] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState(null);
  const [modalErrorMsg, setModalErrorMsg] = useState(null);

  const parseUtcDate = (dateStr) => {
    if (!dateStr) return null;
    return (dateStr.endsWith("Z") || dateStr.includes("+"))
      ? new Date(dateStr)
      : new Date(`${dateStr}Z`);
  };

  // ===== 2. NUEVOS ESTADOS (para el historial) =====
  const [transacciones, setTransacciones] = useState([]); // Guarda la lista de movimientos
  const [loadingHistorial, setLoadingHistorial] = useState(true); // Controla el spinner de la tabla

  // ===== FUNCIÓN: Cargar saldos =====
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

  // ===== 3. FUNCIÓN NUEVA: Cargar historial =====
  const cargarHistorial = async () => {
    if (!user?.usuarioId) return;
    try {
      setLoadingHistorial(true);
      const data = await getHistorialTransacciones(user.usuarioId);
      setTransacciones(data); // Guardamos la lista que vino del backend
    } catch (err) {
      console.error("Error al cargar historial:", err.message);
    } finally {
      setLoadingHistorial(false);
    }
  };

  // ===== 4. useEffect: Cuando entra a la pantalla, pedimos saldos E historial =====
  useEffect(() => {
    cargarDatos();
    cargarHistorial(); // <-- Nueva llamada al entrar
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

      // ===== 5. CLAVE: Refrescamos saldos Y el historial =====
      await cargarDatos();
      await cargarHistorial(); // <-- Aparece el nuevo movimiento automáticamente

      setTimeout(() => {
        setShowModal(false);
        setModalSuccessMsg(null);
      }, 2500);

    } catch (err) {
      setModalErrorMsg(err.message);
      setTimeout(() => {
        setShowModal(false);
        setModalErrorMsg(null);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Helper para formatear moneda =====
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return <div className="loading_wallet">Cargando estado de cuenta...</div>;
  }

  return (
    <div className="billetera-module">

      {/* ============ COLUMNA IZQUIERDA: Saldos y Recarga ============ */}
      <div className="billetera-left-col">
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
      </div>

      {/* ============ COLUMNA DERECHA: Historial de Movimientos ============ */}
      <div className="historial-card">
        <h4 className="recarga-title">Historial de Movimientos</h4>

        {loadingHistorial ? (
          <p className="loading-historial">Cargando movimientos...</p>
        ) : transacciones.length === 0 ? (
          <p className="empty-historial">No hay movimientos registrados aún.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Subasta</th>
                </tr>
              </thead>
              <tbody>
                {/* 6. Recorremos la lista de transacciones con .map() */}
                {transacciones.map((t) => (
                  <tr key={t.id}>
                    <td className="fecha-td">
                      {new Date(parseUtcDate(t.fecha)).toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </td>
                    <td>
                      <span className={`badge-tipo tipo-${t.tipoNombre.toLowerCase()}`}>
                        {t.tipoNombre}
                      </span>
                    </td>
                    <td className={`monto-td ${t.tipo === 1 || t.tipo === 3 || t.tipo === 5 ? "monto-positivo" : "monto-negativo"}`}>
                      {t.tipo === 1 || t.tipo === 3 || t.tipo === 5 ? "+" : "-"}
                      {formatCurrency(t.monto)}
                    </td>
                    <td className="subasta-td">
                      {t.subastaId ? `#${t.subastaId}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <ConfirmModal
          title={
            modalErrorMsg
              ? "Error en la Recarga"
              : modalSuccessMsg
                ? "Recarga Exitosa"
                : "Confirmar Recarga"
          }
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
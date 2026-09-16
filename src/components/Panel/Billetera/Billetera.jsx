import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getSaldo, cargarSaldo } from "../../../services/walletService";
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
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    if (!user?.usuarioId) return;
    try {
      const data = await getSaldo(user.usuarioId);
      setBilletera(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  const handleRecarga = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!montoRecarga || Number(montoRecarga) <= 0) {
      setError("Ingresá un monto válido.");
      return;
    }

    setSubmitting(true);
    try {
      await cargarSaldo(user.usuarioId, montoRecarga);
      setMensaje(`¡Acreditación de $${montoRecarga} realizada con éxito!`);
      setMontoRecarga("");
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando estado de cuenta...</div>;
  }

  return (
    <div className="billetera-module" style={{ maxWidth: "650px", margin: "0 auto" }}>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Desglose de saldos */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 bg-light shadow-sm text-center p-3">
            <span className="text-muted fw-semibold small">Disponible</span>
            <h4 className="fw-bold text-success my-1">
              ${billetera.saldoDisponible.toLocaleString("es-AR")}
            </h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light shadow-sm text-center p-3">
            <span className="text-muted fw-semibold small">Retenido (Pujas)</span>
            <h4 className="fw-bold text-warning my-1">
              ${billetera.saldoRetenido.toLocaleString("es-AR")}
            </h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light shadow-sm text-center p-3">
            <span className="text-muted fw-semibold small">Saldo Total</span>
            <h4 className="fw-bold text-primary my-1">
              ${billetera.saldoTotal.toLocaleString("es-AR")}
            </h4>
          </div>
        </div>
      </div>

      {/* Formulario de recarga */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Recargar Billetera</h5>
          <form onSubmit={handleRecarga}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Monto a cargar ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej: 5000"
                value={montoRecarga}
                onChange={(e) => setMontoRecarga(e.target.value)}
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={submitting}
            >
              {submitting ? "Acreditando..." : "Confirmar Recarga"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
const API_URL = "https://localhost:7000/api/wallet";

/**
 * Obtiene la billetera completa del usuario (BilleteraDto).
 * @param {number} usuarioId
 */
export const getSaldo = async (usuarioId) => {
  const token = localStorage.getItem("subastaYa_token");

  const response = await fetch(`${API_URL}/balance?usuarioId=${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(data.message || data.mensaje || "Error al realizar la recarga.");
  }

  return await response.json(); // Retorna { id, usuarioId, saldoTotal, saldoRetenido, saldoDisponible }
};

/**
 * Realiza la carga de saldo simulada (CargarSaldoDto).
 * @param {number} usuarioId
 * @param {number} monto
 */
export const cargarSaldo = async (usuarioId, monto) => {
  const token = localStorage.getItem("subastaYa_token");

  const response = await fetch(`${API_URL}/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      usuarioId: Number(usuarioId),
      monto: Number(monto),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.mensaje || "Error al realizar la recarga.");
  }

  return data;
};
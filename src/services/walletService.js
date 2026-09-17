// src/services/walletService.js
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/wallet`;

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

  // CORREGIDO: Primero parseamos la respuesta a JSON
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.mensaje || "Error al obtener el saldo.");
  }

  return data; // Retorna { id, usuarioId, saldoTotal, saldoRetenido, saldoDisponible }
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

/**
 * NUEVA FUNCIÓN: Obtiene el historial de movimientos de la billetera (TransaccionLedgerDto).
 * @param {number} usuarioId
 */
export const getHistorialTransacciones = async (usuarioId) => {
  const token = localStorage.getItem("subastaYa_token");

  // Hacemos la petición al endpoint que creaste en C#
  const response = await fetch(`${API_URL}/transactions?usuarioId=${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.mensaje || "Error al obtener el historial.");
  }

  return data; // Retorna un array de TransaccionLedgerDto
};
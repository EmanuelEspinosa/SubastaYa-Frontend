import { API_BASE_URL } from "./apiConfig";

const BASE_URL = `${API_BASE_URL}/auctions`;

// Catálogo server-side: filtros + búsqueda + orden + paginación (B11)
export const getSubastas = async ({
  categoriaId = null, vendedorId = null, compradorId = null, estado = null,
  q = null, orderBy = "fechaFin", order = "asc", page = 1, pageSize = 6
} = {}) => {
  const params = new URLSearchParams();
  if (categoriaId) params.append("categoriaId", categoriaId);
  if (vendedorId) params.append("vendedorId", vendedorId);
  if (compradorId) params.append("compradorId", compradorId);
  if (estado) params.append("estado", estado);
  if (q) params.append("q", q);
  params.append("orderBy", orderBy);
  params.append("order", order);
  params.append("page", page);
  params.append("pageSize", pageSize);
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || e.mensaje || "Error al obtener el catálogo de subastas.");
  }
  return await res.json(); // { items, total, pagina, tamanoPagina, totalPaginas }
};

export const getSubastaById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || e.mensaje || "Subasta no encontrada.");
  }
  return await res.json();
};

export const createSubasta = async (subastaData) => {
  const token = localStorage.getItem("subastaYa_token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(subastaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.mensaje || "No se pudo publicar la subasta.");
  return data;
};

export const realizarPuja = async (subastaId, pujaData) => {
  const token = localStorage.getItem("subastaYa_token");
  const res = await fetch(`${BASE_URL}/${subastaId}/bids`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(pujaData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.mensaje || "Error al realizar la puja.");
  return data;
};

export const getHistorialPujas = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/bids`);
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || e.mensaje || "Error al obtener el historial de pujas.");
  }
  return await res.json();
};

// ===== Consultas dedicadas de actividades (B11) =====
export const getMisPujas = async (usuarioId) => {
  const token = localStorage.getItem("subastaYa_token");
  const res = await fetch(`${API_BASE_URL}/users/${usuarioId}/bids`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || e.mensaje || "Error al obtener tus pujas.");
  }
  return await res.json();
};

export const getMisPublicaciones = async (usuarioId) => {
  const token = localStorage.getItem("subastaYa_token");
  const res = await fetch(`${API_BASE_URL}/users/${usuarioId}/auctions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || e.mensaje || "Error al obtener tus publicaciones.");
  }
  return await res.json();
};
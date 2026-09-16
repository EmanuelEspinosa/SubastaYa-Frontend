const BASE_URL = "https://localhost:7000/api/auctions";

// Obtener catálogo con filtros opcionales (Categoría, Vendedor, Comprador)
export const getSubastas = async (categoriaId = null, vendedorId = null, compradorId = null) => {
  const params = new URLSearchParams();

  if (categoriaId) params.append("categoriaId", categoriaId);
  if (vendedorId) params.append("vendedorId", vendedorId);
  if (compradorId) params.append("compradorId", compradorId);

  const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error al obtener el catálogo de subastas");
  }

  return await res.json();
};

// Obtener detalle de una subasta específica por ID
export const getSubastaById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Subasta no encontrada");
  }
  return await res.json();
};

// Crear nueva subasta
export const createSubasta = async (subastaData) => {
  const token = localStorage.getItem("subastaYa_token");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subastaData),
  });

  if (!res.ok) {
    throw new Error("No se pudo publicar la subasta");
  }

  return await res.json();
};

// Realizar puja en una subasta (POST /api/auctions/{id}/bids)
export const realizarPuja = async (subastaId, pujaData) => {
  const token = localStorage.getItem("subastaYa_token");

  const res = await fetch(`${BASE_URL}/${subastaId}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pujaData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || "Error al realizar la puja");
  }

  return data;
};

// Historial de pujas para la sala en vivo
export const getHistorialPujas = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/bids`);
  if (!response.ok) {
    throw new Error("Error al obtener el historial de pujas");
  }
  return await response.json();
};
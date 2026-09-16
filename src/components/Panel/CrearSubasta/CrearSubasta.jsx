import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { createSubasta } from "../../../services/subastaService";
import { ConfirmModal } from "../../../layout/ConfirmModal/ConfirmModal";
import "./CrearSubasta.css";

export const CrearSubasta = ({ onSuccess }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    categoriaId: 1,
    titulo: "",
    descripcion: "",
    urlImagen: "",
    precioBase: "",
    incrementoMinimo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Estados para la Modal y Feedback
  const [showModal, setShowModal] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState(null);
  const [modalErrorMsg, setModalErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. Abre la modal para pedir confirmación
  const handleOpenModal = (e) => {
    e.preventDefault();
    setModalSuccessMsg(null);
    setModalErrorMsg(null);
    setShowModal(true);
  };

  // 2. Ejecuta el POST a la API al confirmar en la modal
  const handleConfirmarCreacion = async () => {
    setSubmitting(true);
    setModalSuccessMsg(null);
    setModalErrorMsg(null);

    try {
      const payload = {
        vendedorId: Number(user?.usuarioId),
        categoriaId: Number(formData.categoriaId),
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        urlImagen: formData.urlImagen,
        precioBase: Number(formData.precioBase),
        incrementoMinimo: Number(formData.incrementoMinimo),
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
      };

      await createSubasta(payload);

      const msgExito = "¡Subasta creada y publicada con éxito!";
      setModalSuccessMsg(msgExito);

      // Espera 2.5 segundos mostrando el éxito en la modal y redirige
      setTimeout(() => {
        setShowModal(false);
        setModalSuccessMsg(null);
        if (onSuccess) onSuccess(); // Cambia a la pestaña 'Mis Publicaciones'
      }, 2500);

    } catch (err) {
      // Captura DomainException de .NET y la muestra en la modal
      setModalErrorMsg(err.message || "Error al publicar la subasta.");

      setTimeout(() => {
        setShowModal(false);
        setModalErrorMsg(null);
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crear-subasta-card">
      <h3 className="crear-subasta-title">Publicar Nueva Subasta</h3>

      <form onSubmit={handleOpenModal} className="crear-subasta-form">
        <div className="form-row">
          <div className="form-group-wallet">
            <label className="form-label-wallet">Nombre del Producto</label>
            <input
              type="text"
              name="titulo"
              className="recarga-input"
              placeholder="Ej: Reloj Rolex Submariner 2022"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-wallet">
            <label className="form-label-wallet">Categoría</label>
            <select
              name="categoriaId"
              className="recarga-input select-wallet"
              value={formData.categoriaId}
              onChange={handleChange}
              required
            >
              <option value="1">Tecnología</option>
              <option value="2">Coleccionables</option>
              <option value="3">Indumentaria</option>
              <option value="4">Vehículos</option>
            </select>
          </div>
        </div>

        <div className="form-group-wallet">
          <label className="form-label-wallet">Descripción Detallada</label>
          <textarea
            name="descripcion"
            className="recarga-input textarea-subasta"
            rows="3"
            placeholder="Especificá el estado del artículo, año, detalles de envío, etc."
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group-wallet">
          <label className="form-label-wallet">URL de la Imagen del Producto</label>
          <input
            type="url"
            name="urlImagen"
            className="recarga-input"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.urlImagen}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group-wallet">
            <label className="form-label-wallet">Precio Base ($)</label>
            <input
              type="number"
              name="precioBase"
              className="recarga-input"
              placeholder="Ej: 50000"
              value={formData.precioBase}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-wallet">
            <label className="form-label-wallet">Incremento Mínimo ($)</label>
            <input
              type="number"
              name="incrementoMinimo"
              className="recarga-input"
              placeholder="Ej: 2000"
              value={formData.incrementoMinimo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group-wallet">
            <label className="form-label-wallet">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              className="recarga-input"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-wallet">
            <label className="form-label-wallet">Fecha y Hora de Cierre</label>
            <input
              type="datetime-local"
              name="fechaFin"
              className="recarga-input"
              value={formData.fechaFin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="recarga-btn mt-3" disabled={submitting}>
          Publicar Subasta
        </button>
      </form>

      {/* Ventana Modal Reutilizable */}
      {showModal && (
        <ConfirmModal
          title={
            modalErrorMsg
              ? "Error al Publicar"
              : modalSuccessMsg
              ? "¡Publicación Exitosa!"
              : "Confirmar Nueva Subasta"
          }
          prompt={`¿Estás seguro de publicar "${formData.titulo}" con un precio base de $${Number(formData.precioBase || 0).toLocaleString("es-AR")}?`}
          warningText="Una vez creada, la subasta estará visible para todos los compradores registrados."
          confirmText="Publicar Subasta"
          message={modalSuccessMsg}
          errorMessage={modalErrorMsg}
          onConfirm={handleConfirmarCreacion}
          onCancel={() => setShowModal(false)}
          isSubmitting={submitting}
        />
      )}
    </div>
  );
};
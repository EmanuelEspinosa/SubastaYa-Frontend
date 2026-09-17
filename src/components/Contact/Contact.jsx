import { useState } from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faClock,
    faEnvelopeOpenText
} from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "../../layout/ConfirmModal/ConfirmModal";

const initialForm = {
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    localidad: "",
    motivo: "",
    mensaje: ""
};

export const Contact = () => {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = "⚠️ El nombre es obligatorio";
        if (!formData.apellido.trim()) newErrors.apellido = "⚠️ El apellido es obligatorio";

        if (!formData.dni.trim()) {
            newErrors.dni = "⚠️ El DNI es obligatorio";
        } else if (!/^\d{7,8}$/.test(formData.dni)) {
            newErrors.dni = "⚠️ El DNI debe tener entre 7 y 8 dígitos numéricos";
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = "⚠️ El teléfono es obligatorio";
        } else if (!/^\+?\d{8,15}$/.test(formData.telefono)) {
            newErrors.telefono = "⚠️ El teléfono debe ser válido (8 a 15 dígitos)";
        }

        if (!formData.email.includes("@")) newErrors.email = "⚠️ Email inválido. Falta símbolo '@'";
        if (!formData.localidad.trim()) newErrors.localidad = "⚠️ La localidad es obligatoria";

        if (!formData.motivo) newErrors.motivo = "⚠️ Debe seleccionar un motivo de consulta";
        if (!formData.mensaje.trim()) newErrors.mensaje = "⚠️ El mensaje es obligatorio";

        // Si hay errores, los mostramos y cortamos la ejecución
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Si todo está ok: mostramos modal y limpiamos inmediatamente
        setShowModal(true);
        setFormData(initialForm);
        setErrors({});

        // Ocultamos el modal pasados 3 segundos
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    const handleReset = () => {
        setFormData(initialForm);
        setErrors({});
    };

    return (
        <div className="contacto-container">
            <div className="contacto-header-banner">
                <span className="contacto-badge">
                    <FontAwesomeIcon icon={faEnvelopeOpenText} /> Atención al Cliente
                </span>
                <h1 className="contacto-title">Centro de Contacto</h1>
                <p className="contacto-subtitle">
                    ¿Tenés dudas o consultas? Completá el formulario o comunicate directamente con nuestro equipo.
                </p>
            </div>
            <section className="section-contacto">
                {/* COLUMNA 1: FORMULARIO */}
                <div className="form-contacto-card">
                    <form onSubmit={handleSubmit} className="form-contacto">
                        <fieldset className="fieldset-contacto">
                            <legend>Datos Personales</legend>
                            
                            <div className="grid-2-col">
                                <div className="input-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Tu nombre..."
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.nombre && <p className="error-envio">{errors.nombre}</p>}
                                </div>

                                <div className="input-group">
                                    <label>Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        placeholder="Tu apellido..."
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.apellido && <p className="error-envio">{errors.apellido}</p>}
                                </div>

                                <div className="input-group">
                                    <label>DNI</label>
                                    <input
                                        type="number"
                                        name="dni"
                                        placeholder="Sin puntos ni espacios"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.dni && <p className="error-envio">{errors.dni}</p>}
                                </div>

                                <div className="input-group">
                                    <label>Teléfono</label>
                                    <input
                                        type="number"
                                        name="telefono"
                                        placeholder="Ej: 1123456789"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.telefono && <p className="error-envio">{errors.telefono}</p>}
                                </div>

                                <div className="input-group full-width">
                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="ejemplo@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.email && <p className="error-envio">{errors.email}</p>}
                                </div>

                                <div className="input-group full-width">
                                    <label>Localidad</label>
                                    <input
                                        type="text"
                                        name="localidad"
                                        placeholder="Ciudad o Barrio..."
                                        value={formData.localidad}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.localidad && <p className="error-envio">{errors.localidad}</p>}
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="fieldset-contacto">
                            <legend>Consulta</legend>

                            <div className="input-group full-width">
                                <label>Motivo de la consulta</label>
                                <select name="motivo" value={formData.motivo} onChange={handleChange} className="form-control select-control">
                                    <option value="">Seleccione un motivo</option>
                                    <option value="compra_online">Consulta por compra Online</option>
                                    <option value="compra_sucursal">Consulta por error en subasta o puja</option>
                                    <option value="creditos">Consultar sobre créditos SubastaYA</option>
                                    <option value="estado_pedido">Conocer medios de pago</option>
                                    <option value="problemas_pago">Problemas con mi compra / pago</option>
                                    <option value="reclamos_envio">Reclamos por entregas / envíos</option>
                                    <option value="fallas">Reclamo por fallas</option>
                                    <option value="otros">Otras consultas</option>
                                </select>
                                {errors.motivo && <p className="error-envio">{errors.motivo}</p>}
                            </div>

                            <div className="input-group full-width input-mensaje">
                                <label>Mensaje</label>
                                <textarea
                                    name="mensaje"
                                    placeholder="Escribí aquí los detalles de tu consulta..."
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    className="form-control textarea-control"
                                />
                                {errors.mensaje && <p className="error-envio">{errors.mensaje}</p>}
                            </div>
                        </fieldset>

                        <div className="actions-form">
                            <button type="button" className="btn-limpiar" onClick={handleReset}>Limpiar</button>
                            <button type="submit" className="btn-enviar">Enviar Consulta</button>
                        </div>
                    </form>
                </div>

                {/* COLUMNA 2: MAPA E INFORMACIÓN */}
                <div className="contacto-info-card">
                    <h4>Para atención comercial presencial visitá nuestra oficina</h4>
                    <div className="sucur-mapa">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.3489323787234!2d-58.4367664849357!3d-34.617003980454915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb6f7e4c84a3%3A0xfed3ea3aa34625f4!2sAv.%20Rivadavia%204500%2C%20C1407%20CABA!5e0!3m2!1ses!2sar!4v1694303889022!5m2!1ses!2sar"
                            allowFullScreen
                            loading="lazy"
                            title="Mapa Ubicación Central"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="info-list">
                        <div className="info-item">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-suc" />
                            <div>
                                <strong>Dirección</strong>
                                <p>Av. Rivadavia 4500 - CABA</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faPhone} className="icon-suc" />
                            <div>
                                <strong>Atención Telefónica</strong>
                                <p>(+54) 11 - 4250-0111</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faEnvelope} className="icon-suc" />
                            <div>
                                <strong>Correo Electrónico</strong>
                                <p>contacto@subastaya.com.ar</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faClock} className="icon-suc" />
                            <div>
                                <strong>Horarios de Atención</strong>
                                <p>Lun a Vie: 8:30 a 19:30 hs | Sáb: 8:30 a 12:30 hs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <ConfirmModal
                        message={"Mensaje enviado con éxito. Te responderemos a la brevedad."}
                    />
                )}
            </section>
        </div>
    );
};
import { Link } from "react-router-dom";
import "./Item.css";

export const Item = ({
    id,
    titulo,
    descripcion,
    urlImagen,
    categoriaNombre,
    vendedorNombre,
    ofertaMasAltaActual,
    precioBase,
    cantidadOfertas,
    estado
}) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const getEstadoInfo = (estadoNum) => {
        switch (estadoNum) {
            case 2:
                return { texto: "Activa", clase: "estado-activa" };
            case 3:
                return { texto: "Finalizada", clase: "estado-finalizada" };
            default:
                return { texto: "Pendiente", clase: "estado-pendiente" };
        }
    };

    const { texto: estadoTexto, clase: estadoClase } = getEstadoInfo(estado);

    return (
        <article className="cardProduct">
            <div className="product-img">
                <img src={urlImagen || "/images/placeholder.png"} alt={titulo} />
                <span className={`status-badge ${estadoClase}`}>
                    {estadoTexto}
                </span>
            </div>

            <div className="product-info">
                <h2 className="product-name">{titulo}</h2>
                <p className="brand">Vendedor: {vendedorNombre || "Anónimo"}</p>
                <p className="category">{categoriaNombre}</p>

                {descripcion && (
                    <p className="feature">
                        {descripcion.length > 80 ? `${descripcion.slice(0, 80)}...` : descripcion}
                    </p>
                )}

                <div className="section-precio">
                    <div className="section-priceReal">
                        <span className="price-label">
                            {cantidadOfertas > 0 ? "Oferta actual:" : "Precio base:"}
                        </span>
                        <div className="price-tag">
                            {formatCurrency(ofertaMasAltaActual || precioBase)}
                        </div>
                    </div>
                    <div className="bids-count">
                        {cantidadOfertas} {cantidadOfertas === 1 ? "oferta" : "ofertas"}
                    </div>
                </div>

                <Link to={`/subasta/${id}`} className="detail-button">
                    {estado === 2 ? "Ingresar y Ofertar" : "Ver Detalle"}
                </Link>
            </div>
        </article>
    );
};
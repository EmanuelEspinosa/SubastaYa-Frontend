import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./FilterBar.css";

export const FilterBar = ({
    categorias,
    setPageActual,
    search,
    setSearch,
    setSortOrder,
    sortOrder,
    products,
    estados
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showPrice, setShowPrices] = useState(false);
    const [showEstado, setShowEstado] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    // Obtenemos los valores activos directamente de la Query String
    const categoriaId = searchParams.get("categoriaId");
    const estId = searchParams.get("estado");

    const toggleFilters = () => setShowFilters(!showFilters);
    const toggleCategories = () => setShowCategories(!showCategories);
    const togglePrice = () => setShowPrices(!showPrice);
    const toggleEstado = () => setShowEstado(!showEstado);

    const handleClick = (catId) => {
        const nuevosParams = new URLSearchParams(searchParams);
        
        if (!catId || catId === "Todas") {
            nuevosParams.delete("categoriaId");
        } else {
            nuevosParams.set("categoriaId", catId);
        }

        setSearchParams(nuevosParams);
        setPageActual(1);
    };

    const estadoHadleClick = (estadoId) => {
        const nuevosParams = new URLSearchParams(searchParams);
        
        if (!estadoId || estadoId === "Todos") {
            nuevosParams.delete("estado");
        } else {
            nuevosParams.set("estado", estadoId);
        }

        setSearchParams(nuevosParams);
        setPageActual(1);
    };

    return (
        <div className="filter-bar">
            {/* Botón principal y buscador */}
            <div className="filters-search">
                <div className="filter-options">
                    <button className="toggle-btnFilters" onClick={toggleFilters}>
                        Filtros {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {/* Barra de búsqueda */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar subastas..."
                            value={search}
                            onChange={(e) => {
                                setPageActual(1);
                                setSearch(e.target.value);
                            }}
                        />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                </div>

                <div className="results-container">
                    <div className="results-count">
                        {categoriaId ? (
                            <p>
                                <strong>{products.length} {products.length === 1 ? "resultado" : "resultados"}</strong> para esta categoría
                            </p>
                        ) : (
                            <p>Mostrando <strong>{products.length} subastas</strong></p>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel desplegable de filtros */}
            {showFilters && (
                <div className="filters-panel">
                    {/* Sección Categorías */}
                    <div className="filter-section section-category">
                        <button className="toggle-btnCateg" onClick={toggleCategories}>
                            Categorías {showCategories ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {showCategories && (
                            <div className="filter-tags">
                                <button
                                    className={!categoriaId ? "active" : ""}
                                    onClick={() => {
                                        handleClick("Todas");
                                        setShowFilters(false);
                                    }}
                                >
                                    Todas
                                </button>
                                {categorias.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={Number(categoriaId) === cat.id ? "active" : ""}
                                        onClick={() => {
                                            handleClick(cat.id);
                                            setShowFilters(false);
                                        }}
                                    >
                                        {cat.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sección Estado */}
                    <div className="filter-section section-category">
                        <button className="toggle-btnCateg" onClick={toggleEstado}>
                            Estado {showEstado ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {showEstado && (
                            <div className="filter-tags">
                                <button
                                    className={!estId ? "active" : ""}
                                    onClick={() => {
                                        estadoHadleClick("Todos");
                                        setShowFilters(false);
                                    }}
                                >
                                    Todos
                                </button>
                                {estados.map((item) => (
                                    <button
                                        key={item.id}
                                        className={Number(estId) === item.id ? "active" : ""}
                                        onClick={() => {
                                            estadoHadleClick(item.id);
                                            setShowFilters(false);
                                        }}
                                    >
                                        {item.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sección Ordenamiento por Precio */}
                    <div className="filter-section">
                        <button className="toggle-btnPrice" onClick={togglePrice}>
                            Ordenar por {showPrice ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {showPrice && (
                            <div className="filter-tags">
                                <button
                                    className={sortOrder === "sin_filtrar" ? "active" : ""}
                                    onClick={() => {
                                        setPageActual(1);
                                        setSortOrder("sin_filtrar");
                                        setShowFilters(false);
                                    }}
                                >
                                    Sin filtrar
                                </button>
                                <button
                                    className={sortOrder === "desc" ? "active" : ""}
                                    onClick={() => {
                                        setPageActual(1);
                                        setSortOrder("desc");
                                        setShowFilters(false);
                                    }}
                                >
                                    Mayor Oferta
                                </button>
                                <button
                                    className={sortOrder === "asc" ? "active" : ""}
                                    onClick={() => {
                                        setPageActual(1);
                                        setSortOrder("asc");
                                        setShowFilters(false);
                                    }}
                                >
                                    Menor Oferta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
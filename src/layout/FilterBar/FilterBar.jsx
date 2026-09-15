import { useNavigate, useParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./FilterBar.css";
import { useState } from "react";

export const FilterBar = ({ categorias, setPageActual, search, setSearch, setSortOrder, sortOrder, products }) => {

    const [showFilters, setShowFilters] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showPrice, setShowPrices] = useState(false);

    const navigate = useNavigate();
    const { categoriaId } = useParams();

    const toggleFilters = () => setShowFilters(!showFilters);
    const toggleCategories = () => setShowCategories(!showCategories);
    const togglePrice = () => setShowPrices(!showPrice);

    const handleClick = (catId) => {
        if (!catId || catId === "Todas") {
            navigate("/");
        } else {
            navigate(`/categoria/${catId}`);
        }
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

                    {/* Sección Por Oferta */}
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
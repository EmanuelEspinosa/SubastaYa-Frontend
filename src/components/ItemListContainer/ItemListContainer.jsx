import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ItemList } from "../ItemList/ItemList";
import { Pagination } from "../../layout/Pagination/Pagination";
import { FilterBar } from "../../layout/FilterBar/FilterBar";
import { getSubastas } from "../../services/subastaService";
import "./ItemListContainer.css";

export const ItemListContainer = () => {
    const [subastas, setSubastas] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("sin_filtrar");

    const [searchParams] = useSearchParams();
    const categoriaId = searchParams.get("categoriaId");
    const estId = searchParams.get("estado");

    const categoriasDisponibles = [
        { id: 1, nombre: "Tecnología" },
        { id: 2, nombre: "Coleccionables" },
        { id: 3, nombre: "Indumentaria" },
        { id: 4, nombre: "Vehículos" }
    ];
    const estados = [
        { id: 1, nombre: "Programada" },
        { id: 2, nombre: "Activa" },
        { id: 3, nombre: "Finalizada" },
        { id: 4, nombre: "Desierta" }
    ];
    const categoriaNombreActual = categoriasDisponibles.find(
        (c) => c.id === Number(categoriaId)
    )?.nombre;

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 350);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Catálogo 100% server-side (B11): filtros, búsqueda, orden y paginación
    useEffect(() => {
        getSubastas({
            categoriaId: categoriaId ? Number(categoriaId) : null,
            estado: estId ? Number(estId) : null,
            q: debouncedSearch || null,
            orderBy: sortOrder === "sin_filtrar" ? "fechaFin" : "oferta",
            order: sortOrder === "sin_filtrar" ? "asc" : sortOrder,
            page: paginaActual,
            pageSize: 6
        })
            .then((data) => {
                setSubastas(Array.isArray(data.items) ? data.items : []);
                setTotalResults(data.total ?? 0);
                setTotalPaginas(data.totalPaginas ?? 1);
            })
            .catch((err) => {
                console.error("Error al obtener subastas de la API:", err);
                setSubastas([]); setTotalResults(0); setTotalPaginas(1);
            });
    }, [categoriaId, estId, debouncedSearch, sortOrder, paginaActual]);

    return (
        <section id="products" className="sectionProducts">
            <div className="list-container">
                <div className="breadcrumb">
                    {categoriaId ? (
                        <p>
                            <Link className="breadcrumb-link" to={'/'}>Inicio</Link> /
                            <Link className="breadcrumb-link" to={"/"}> Subastas</Link> / {categoriaNombreActual || `Categoría ${categoriaId}`}
                        </p>
                    ) : (
                        <p>
                            <Link className="breadcrumb-link" to={'/'}>Inicio</Link> / Subastas
                        </p>
                    )}
                </div>
                <FilterBar
                    categorias={categoriasDisponibles}
                    setPageActual={setPaginaActual}
                    search={searchTerm}
                    setSearch={setSearchTerm}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    products={subastas}
                    totalResults={totalResults}
                    estados={estados}
                />
                <div className="products-container">
                    <div className="listproducts">
                        <ItemList list={subastas} />
                    </div>
                    <Pagination
                        totalPages={totalPaginas}
                        paginaActual={paginaActual}
                        setPaginaActual={setPaginaActual}
                    />
                </div>
            </div>
        </section>
    );
};
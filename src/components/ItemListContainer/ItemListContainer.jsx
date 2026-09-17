import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ItemList } from "../ItemList/ItemList";
import { Pagination } from "../../layout/Pagination/Pagination";
import { FilterBar } from "../../layout/FilterBar/FilterBar";
import { getSubastas } from "../../services/subastaService"; 
import "./ItemListContainer.css";

export const ItemListContainer = () => {
    const [subastas, setSubastas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("sin_filtrar");

    // Leemos los filtros activos desde la Query String de la URL
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
        setPaginaActual(1);
        
        // Enviamos tanto la categoría como el estado simultáneamente a la API
        getSubastas(
            categoriaId ? Number(categoriaId) : null,
            null,
            null,
            estId ? Number(estId) : null
        )
            .then((data) => {
                if (data && data.length > 0) {
                    setSubastas(data);
                } else {
                    setSubastas([]);
                }
            })
            .catch((err) => {
                console.error("Error al obtener subastas de la API:", err);
                setSubastas([]);
            });
    }, [categoriaId, estId]);

    // Filtrado local por buscador de texto
    let filteredAuctions = searchTerm === "" 
        ? subastas 
        : subastas.filter((s) =>
            (s.titulo && s.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (s.descripcion && s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (s.categoriaNombre && s.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    // Ordenamiento local por monto
    if (sortOrder === "asc") {
        filteredAuctions = [...filteredAuctions].sort((a, b) => a.ofertaMasAltaActual - b.ofertaMasAltaActual);
    } else if (sortOrder === "desc") {
        filteredAuctions = [...filteredAuctions].sort((a, b) => b.ofertaMasAltaActual - a.ofertaMasAltaActual);
    }

    // Paginado
    const subastasPorPagina = 6;
    const indiceInicial = (paginaActual - 1) * subastasPorPagina;
    const indiceFinal = indiceInicial + subastasPorPagina;
    const subastasVisibles = filteredAuctions.slice(indiceInicial, indiceFinal);

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
                    products={filteredAuctions}
                    estados={estados}
                />

                <div className="products-container">
                    <div className="listproducts">
                        <ItemList list={subastasVisibles} />
                    </div>

                    <Pagination
                        products={filteredAuctions}
                        paginaActual={paginaActual}
                        setPaginaActual={setPaginaActual}
                        productosPorPagina={subastasPorPagina}
                    />
                </div>
            </div>
        </section>
    );
};
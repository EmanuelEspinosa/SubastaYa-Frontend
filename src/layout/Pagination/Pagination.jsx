import { useEffect, useState } from "react";
import "./Pagination.css"
import { Link } from "react-router-dom";


export const Pagination = ({ products, paginaActual, setPaginaActual, productosPorPagina }) => {
    const totalPages = Math.ceil(products.length / productosPorPagina);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 750);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const onPreviusPage = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    };

    const onNextPage = () => {
        if (paginaActual < totalPages) {
            setPaginaActual(paginaActual + 1);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    };

    const pageActualSet = (page) => {
        setPaginaActual(page);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };


    const renderBotones = () => {
        const botones = [];

        if (!isMobile || totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                botones.push(
                    <button
                        key={i}
                        onClick={() => pageActualSet(i)}
                        className={paginaActual === i ? "activo" : "btn-page"}
                    >
                        {i}
                    </button>
                );
            }
            return botones;
        }

        botones.push(
            <button
                key={1}
                onClick={() => pageActualSet(1)}
                className={paginaActual === 1 ? "activo" : "btn-page"}
            >
                1
            </button>
        );

        if (paginaActual > 3) {
            botones.push(<span key="start-ellipsis" className="ellipsis">…</span>);
        }

        if (paginaActual !== 1 && paginaActual !== totalPages) {
            botones.push(
                <button
                    key={paginaActual}
                    onClick={() => pageActualSet(paginaActual)}
                    className="activo"
                >
                    {paginaActual}
                </button>
            );
        }

        if (paginaActual < totalPages - 2) {
            botones.push(<span key="end-ellipsis" className="ellipsis">…</span>);
        }

        botones.push(
            <button
                key={totalPages}
                onClick={() => pageActualSet(totalPages)}
                className={paginaActual === totalPages ? "activo" : "btn-page"}
            >
                {totalPages}
            </button>
        );

        return botones;
    };


    return (
        <div className="pagination">
            <button
                className={`pagination-previous ${paginaActual === 1 ? "is-disabled" : ""}`}
                onClick={onPreviusPage}
            >
                Anterior
            </button>

            {renderBotones()}

            <button
                className={`pagination-next ${paginaActual >= totalPages ? "is-disabled" : ""}`}
                onClick={onNextPage}
            >
                Siguiente
            </button>
        </div>
    );
};

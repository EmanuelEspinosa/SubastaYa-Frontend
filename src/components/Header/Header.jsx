import { useState } from "react"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Header.css"


export const Header = () => {
    const [menuMovil, SetMenuMovil] = useState(false);

    return (
        <header>
            <Link to={"/"}>
                <section className="logo_header">
                    <img src="/images/Logo/iconoEmpresa1.jpg" alt="Logo comercio" />
                    <p>SUBASTA YA</p>
                </section>
            </Link>

            <div className="header-navar">
                <div className="navegation-header">
                    <nav className={menuMovil ? "navbar active" : "navbar"}>
                        <ul className="nav-ul">
                            <li>
                                <Link
                                    className="nav-item"
                                    to={"/"}
                                    onClick={menuMovil ? () => SetMenuMovil(!menuMovil) : ""}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="nav-item"
                                    to={"/aboutUs"}
                                    onClick={menuMovil ? () => SetMenuMovil(!menuMovil) : ""}>
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="nav-item"
                                    to={"/products"}
                                    onClick={menuMovil ? () => SetMenuMovil(!menuMovil) : ""}>
                                    Subastas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="nav-item"
                                    to={"/contact"}
                                    onClick={menuMovil ? () => SetMenuMovil(!menuMovil) : ""}>
                                    Contacto
                                </Link>
                            </li>

                        </ul>
                    </nav>

                    
                </div>

                <span className="iconMenuMovil" onClick={() => SetMenuMovil(!menuMovil)}>
                    {
                        menuMovil ? (
                            <FontAwesomeIcon icon={faTimes} size="2x" />
                        ) : (
                            <FontAwesomeIcon icon={faBars} size="2x" />
                        )
                    }
                </span>
            </div>
        </header>
    );
}
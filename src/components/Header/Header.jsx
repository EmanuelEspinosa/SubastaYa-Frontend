import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export const Header = () => {
  const [menuMovil, setMenuMovil] = useState(false);
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuMovil(!menuMovil);
  const closeMenu = () => setMenuMovil(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    navigate("/");
  };

  return (
    <header>
      <Link to={"/"} onClick={closeMenu}>
        <section className="logo_header">
          <img src="/images/Logo/iconoEmpresa1.jpg" alt="Logo comercio" />
          <div>
            Subasta<span>YA</span>
          </div>
        </section>
      </Link>

      <div className="header-navar">
        <div className="navegation-header">
          <nav className={menuMovil ? "navbar active" : "navbar"}>
            <ul className="nav-ul">
              <li>
                <Link className="nav-item" to={"/"} onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="nav-item" to={"/aboutUs"} onClick={closeMenu}>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link className="nav-item" to={"/products"} onClick={closeMenu}>
                  Subastas
                </Link>
              </li>
              <li>
                <Link className="nav-item" to={"/contact"} onClick={closeMenu}>
                  Contacto
                </Link>
              </li>

              {/* Renderizado condicional según estado de autenticación */}
              {isAuthenticated ? (
                <>
                  <li className="user-info">
                    <span className="user-name">
                      <FontAwesomeIcon icon={faUser} className="icon-user" />
                      Hola, {user?.nombre}
                    </span>
                  </li>
                  <li>
                    <button className="btn-logout" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faRightFromBracket} className="icon-logout" />
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="li-login">
                    <Link className="nav-item nav-auth nav-login" to={"/login"} onClick={closeMenu}>
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-auth nav-register" to={"/registro"} onClick={closeMenu}>
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <span className="iconMenuMovil" onClick={toggleMenu}>
          {menuMovil ? (
            <FontAwesomeIcon icon={faTimes} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="2x" />
          )}
        </span>
      </div>
    </header>
  );
};
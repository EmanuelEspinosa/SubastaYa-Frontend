import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import {
  faBars,
  faTimes,
  faUser,
  faRightFromBracket,
  faChevronDown,
  faGavel,
  faBoxes,
  faWallet
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export const Header = () => {
  const [menuMovil, setMenuMovil] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuMovil(!menuMovil);
  const closeAllMenus = () => {
    setMenuMovil(false);
    setDropdownOpen(false);
  };

  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    closeAllMenus();
    navigate("/");
  };

  return (
    <header>
      <Link to={"/"} onClick={closeAllMenus}>
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
                <Link className="nav-item" to={"/"} onClick={closeAllMenus}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="nav-item" to={"/aboutUs"} onClick={closeAllMenus}>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link className="nav-item" to={"/contact"} onClick={closeAllMenus}>
                  Contacto
                </Link>
              </li>

              {/* Menú según autenticación */}
              {isAuthenticated ? (
                <li className="user-dropdown-container" ref={dropdownRef}>
                  <button
                    className="user-dropdown-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <FontAwesomeIcon icon={faUser} className="icon-user" />
                    <span>Hola, {user?.nombre}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`icon-chevron ${dropdownOpen ? "rotate" : ""}`}
                    />
                  </button>

                  {/* Submenú desplegable */}
                  <div className={`user-dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    <Link
                      to="/mi-panel?tab=compras"
                      className="dropdown-item"
                      onClick={closeAllMenus}
                    >
                      <FontAwesomeIcon icon={faGavel} /> Mis Compras / Pujas
                    </Link>
                    <Link
                      to="/mi-panel?tab=publicaciones"
                      className="dropdown-item"
                      onClick={closeAllMenus}
                    >
                      <FontAwesomeIcon icon={faBoxes} /> Mis Publicaciones
                    </Link>
                    <Link
                      to="/mi-panel?tab=billetera"
                      className="dropdown-item"
                      onClick={closeAllMenus}
                    >
                      <FontAwesomeIcon icon={faWallet} /> Mi Billetera
                    </Link>
                    <Link
                      to="/mi-panel?tab=crear"
                      className="dropdown-item"
                      onClick={closeAllMenus}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Crear Subasta
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faRightFromBracket} /> Salir
                    </button>
                  </div>
                </li>
              ) : (
                <>
                  <li className="li-login">
                    <div>
                      <Link className="nav-item nav-auth nav-login" to={"/login"} onClick={closeAllMenus}>
                        Ingresar
                      </Link>
                      <Link className="nav-item nav-auth nav-register" to={"/registro"} onClick={closeAllMenus}>
                        Registrarse
                      </Link>
                    </div>
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
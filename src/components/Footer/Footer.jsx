import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import "./Footer.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'


export const Footer = () => {
    return (
        <footer>
            <section className="footer-secciones">
                <div className="footer_card footer_section1">
                    <div className="section1-logo">
                        <img src="/images/Logo/iconoEmpresa2.jpg" alt="Logo comercio" />
                    </div>

                    <div className="datos_footer-section1">
                        <div>SUBASTA YA es un portal de subastas online que te permite ofertar de manera ágil, sencilla y segura.</div>
                        <div><FontAwesomeIcon icon={faMap} />Av.Rivadavia 4500 - CABA</div>
                        <div><FontAwesomeIcon icon={faEnvelope} />informacion@subastaya.org.ar</div>

                    </div>
                </div>

                <div className="footer_card footer_section2">
                    <div>
                        <h3>Links de interes</h3>
                        <ul>
                            <li><Link className="item-section2" to={"/"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</Link></li>
                            <li><Link className="item-section2" to={"/aboutUs"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Sobre Nosotros</Link></li>
                            <li><Link className='item-section2' to={"/products"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} >Subastas</Link></li>
                            <li><Link className="item-section2" to={"/contact"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Contacto</Link></li>
                            <li><Link className="item-section2" to={"/cart"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Mi historial</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer_card footer_section3">
                    <h3>Seguinos en nuestras Redes Sociales</h3>
                    <p className="footer-info">Contamos con atención personalizada para ayudarte a encontrar el producto ideal para vos.</p>
                    <div className="iconos_redes">
                        <a className="footer-icono" href="https://www.facebook.com" target="_blank">
                            <img src="/images/RedesSociales/Facebook.png" alt="" /> </a>
                        <a className="footer-icono" href="https://www.instagram.com" target="_blank">
                            <img src="/images/RedesSociales/Instagram.png" alt="" /> </a>
                        <a className="footer-icono" href="https://www.twitter.com" target="_blank">
                            <img src="/images/RedesSociales/Twitter-nuevo.png" alt="" /> </a>
                        <a className="footer-icono" href="https://www.linkedin.com" target="_blank">
                            <img src="/images/RedesSociales/Linkedin.png" alt="" /> </a>
                        <a className="footer-icono" href="https://www.youtube.com" target="_blank">
                            <img src="/images/RedesSociales/YouTube.png" alt="" /> </a>
                    </div>
                </div>
            </section>

            <div className="derechos">
                <p>Copyright 2026. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}
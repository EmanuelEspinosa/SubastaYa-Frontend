import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

export const MainLayout = () => {
    return (
        <div className="main-container">
            <Header />
            <div className="main-content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
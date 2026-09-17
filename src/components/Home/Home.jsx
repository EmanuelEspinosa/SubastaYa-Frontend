import { SliderContainer } from "../../layout/Slider/SliderContainer/SliderContainer";
import { ItemListContainer } from "../ItemListContainer/ItemListContainer";
import "./Home.css";
import { Newsletter } from "../../layout/Newsletter/Newsletter";

export const Home = () => {
    const slides = [
        (
            <div className="item slider_content-item1"></div>
        ),
        (
            <div className="item slider_content-item2"></div>
        ),
        (
            <div className="item slider_content-item3"></div>
        ),
    ];
    
    const handleSubscribe = () => {
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            setEmail("");
        }, 3000);
    }

    return(
        <div className="container-page">
            <SliderContainer slides={slides} />
            <ItemListContainer />
            <Newsletter />
        </div>
    );
}
import { SliderContainer } from "../../layout/Slider/SliderContainer/SliderContainer";

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

    
    return(
        <div className="container-page">
            <SliderContainer slides={slides} />
        </div>
    );
}
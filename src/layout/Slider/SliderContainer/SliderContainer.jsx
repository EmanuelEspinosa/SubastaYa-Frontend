import { useEffect, useRef, useState } from "react";
import { SliderView } from "../SliderView/SliderView";

export const SliderContainer = ({ slides }) => {
    const [active, setActive] = useState(0);
    const itemRefs = useRef([]);
    const [trackStyle, setTrackStyle] = useState({ left: "0px" });
    const intervalRef = useRef(null);


    const startAutoplay = () => {
        stopAutoplay();
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % slides.length);
        }, 7000);
    };

    const stopAutoplay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const restartAutoplay = () => {
        startAutoplay();
    };

    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, [slides.length]);

    useEffect(() => {
        const currentItem = itemRefs.current[active];
        if (!currentItem) return;
        const checkLeft = currentItem.offsetLeft; 
        setTrackStyle({ left: `-${checkLeft}px` });
    }, [active]);


    const onNext = () => {
        setActive(prev => (prev + 1 > slides.length - 1 ? 0 : prev + 1));
        restartAutoplay(); 
    };

    const onPrev = () => {
        setActive(prev => (prev - 1 < 0 ? slides.length - 1 : prev - 1));
        restartAutoplay();
    };

    const onDotClick = (index) => {
        setActive(index);
        restartAutoplay();
    };

    return (
        <SliderView
            slides={slides.map((slide, i) => (
                <div
                    ref={el => (itemRefs.current[i] = el)}
                    key={i}
                >
                    {slide}
                </div>
            ))}
            active={active}
            onPrev={onPrev}
            onNext={onNext}
            onDotClick={onDotClick}
            trackStyle={trackStyle}
        />
    );
};
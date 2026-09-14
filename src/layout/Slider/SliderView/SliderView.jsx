import "./SliderView.css";

export const SliderView = ({ slides, active, onPrev, onNext, onDotClick, trackStyle }) => {
    return (
        <section className="slider">

            <div className="slider_content" style={trackStyle}>
                {slides}
            </div>

            <div className="buttons">
                <button id="prev" onClick={onPrev}>&#10094;</button>
                <button id="next" onClick={onNext}>&#10095;</button>
            </div>

            <ul className="dots">
                {slides.map((_, i) => (
                    <li
                        key={i}
                        className={i === active ? "active" : ""}
                        onClick={() => onDotClick(i)}
                    />
                ))}
            </ul>

        </section>
    )
}
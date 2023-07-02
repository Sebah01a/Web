import React, { useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import "./Slider.css"

const SliderInstrucciones = () => {


    const instrucciones = [
        { image: "../src/assets/imgs/instrucciones_preparacion.png" },
        { image: "../src/assets/imgs/instrucciones_juego.png" },
        { image: "../src/assets/imgs/instrucciones_objetivo.png" },
    ];
    const [current, setCurrent] = useState(0);
    const length = instrucciones.length;
  
    const nextSlide = () => {
      setCurrent((current + 1) % length);
    };
  
    const prevSlide = () => {
      setCurrent((current - 1 + length) % length);
    };
  
    if (!Array.isArray(instrucciones) || instrucciones.length <= 0) {
      return null;
    }
  
    return (
      <>
        <h2 className="slider-title-ins">Instrucciones</h2>
        <section className="slider">
          <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
          <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
          {instrucciones.map((slide, index) => (
            <div className={index === current ? "slide active" : "slide"} key={index}>
              {index === current && <img src={slide.image} alt={`Slide ${index}`} className="image" />}
            </div>
          ))}
        </section>
      </>
    );
  };

export default SliderInstrucciones;

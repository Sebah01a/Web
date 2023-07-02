import React, { useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import "./Slider.css"

const SliderFacultades = () => {


    const facultades = [
        { titulo: "Agronomia", image: "../src/assets/imgs/agronomia.jpg" },
        { titulo: "Artes", image: "../src/assets/imgs/artes.jpg" },
        { titulo: "Biologia", image: "../src/assets/imgs/biologia.jpg" },
        { titulo: "Comunicaciones", image: "../src/assets/imgs/comunicaciones.jpg" },
        { titulo: "Derecho", image: "../src/assets/imgs/derecho.jpg" },
        { titulo: "Diseño", image: "../src/assets/imgs/diseno.jpg" },
        { titulo: "Educacion", image: "../src/assets/imgs/educacion.jpg" },
        { titulo: "Filosofia", image: "../src/assets/imgs/filosofia.jpg" },
        { titulo: "Fisica", image: "../src/assets/imgs/fisica.jpg" },
        { titulo: "Ingenieria", image: "../src/assets/imgs/ingenieria.jpg" },
        { titulo: "Letras", image: "../src/assets/imgs/letras.jpg" },
        { titulo: "Matematicas", image: "../src/assets/imgs/matematicas.jpg" },
        { titulo: "Medicina", image: "../src/assets/imgs/medicina.jpg" },
        { titulo: "Politica", image: "../src/assets/imgs/politica.jpg" },
        { titulo: "Quimica", image: "../src/assets/imgs/quimica.jpg" },
        { titulo: "Sociales", image: "../src/assets/imgs/sociales.png" },
        { titulo: "Teologia", image: "../src/assets/imgs/teologia.jpg" },
    ];

    const [current, setCurrent] = useState(0);
    const length = facultades.length;

    const nextSlide = () => {
        setCurrent((current + 1) % length);
      };
    
      const prevSlide = () => {
        setCurrent((current - 1 + length) % length);
      };

    if (!Array.isArray(facultades) || facultades.length <= 0) {
        return null;
    }



    return (
        <>
            <h2 className='slider-title-fac'>Facultades que puedes adquirir en UC Tycoon</h2>
            <section className='slider'>
                <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
                <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
                {facultades.map((slide, index) => {
                    return (
                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                            {index === current && (<img src={slide.image} className='image' />)}
                            <h3>{index === current && slide.titulo}</h3>
                        </div>
                    );
                })}
            </section>
        </>
    )
}

export default SliderFacultades;

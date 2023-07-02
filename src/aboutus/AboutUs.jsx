import './AboutUs.css'
import emilio from "../assets/imgs/emilio.jpg"
import seba from "../assets/imgs/seba.jpg"

export default function AboutUs() {

    return (
        <div className="aboutus">
            <h1 class="title">Sobre Nosotros</h1>
            <div className="bigcontainer">
                <div className="smallcontainer">
                    <h2 className='us-h2'>Sebastian Hola</h2>
                    <img src={seba} alt="" />
                    <p className='desc-us'>Hola! Estoy estudiando Ingeniería civil con Major en Software y Minor en Industrial (eso está por verse). Voy en cuarto año y junto a Emilio hemos trabajado varias veces antes, siempre bien. Me gusta harto la idea de este proyecto y quiero aprender lo mas posible ya que siento que es una herramienta fundamental para lo que quiero hacer en el futuro.</p>

                </div>
                <div className="smallcontainer">
                    <h2 className='us-h2'>Emilio Latorre</h2>
                    <img src={emilio} alt="" />
                    <p className='desc-us'>Hola! Soy estudiante de Cuarto año de Ingeniería Civil, Major Ingeniería de Software y Minor Industrial. Este proyecto me motiva bastante, creo que nos puede entregar grandes herramientas para el futuro tanto a mi como a mi compañero Sebastian. Algo mas personal, me gusta el tenis y la música electrónica.</p>

                </div>
            </div>
        </div>
    )
}
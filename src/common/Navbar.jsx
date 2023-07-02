import './Navbar.css'
import logo from "../assets/imgs/logo-text.png"

export default function Navbar() {
  return (
    <div className="container-nav">
      <div className='left-nav'>
        <a href="/" >
          <img src={logo} className="logo" />
        </a>
      </div>
      <div className='right-nav'>
        <a className="navbtn" href="/">Inicio</a>
        <a className="navbtn" href="/mainsite">Principal</a>
        <a className="navbtn" href="/instructions">Instrucciones</a>
        <a className="navbtn" href="/aboutus">Nosotros</a>
        <a className="navbtn" href="/register">Register</a>
      </div>

    </div>
  )
}
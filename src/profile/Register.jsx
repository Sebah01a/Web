import { useState } from "react"
import { Link } from "react-router-dom"
import "./Register.css"
import logo from "../assets/imgs/LOGO.png"
import sjAereo from "../assets/imgs/sj_aereo.jpg"

export default function Landing() {
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [mail, setEmail] = useState("")

  function handleChangeNombre(event) {
    setNombre(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }

  async function createUser() {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: nombre, password: password, mail: mail }),
        
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data);
        window.location.href = `/mainsite/${data.id}`;
        // Add any additional logic or redirection after user creation
      } else {
        const data = await response.json();
        window.alert(data.errors[0].message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      window.alert("An error occurred while creating the user. Please try again later.", error);
    }
  }


  return (
    <div className="land">
      <img src={logo} alt="" />
      <h3>La educación es un negocio, ¡Tú decides cómo invertir!</h3>
      <div className="container-land">
        <h4 className="label">Nuevo usuario</h4>
        <input type="text" placeholder="Nombre" value={nombre} onChange={handleChangeNombre} />
        <h4 className="label">Contraseña</h4>
        <input type="password" placeholder="Contraseña" value={password} onChange={handleChangePassword} />
        <h4 className="label">Correo electrónico</h4>
        <input type="mail" placeholder="Correo electrónico" value={mail} onChange={handleChangeEmail} />
        <p className="label">Bienvenid@ {nombre}</p>

        <button className="btn" onClick={createUser}>
          Registrarse
        </button>
      </div>
      <img src={sjAereo} alt="" />
    </div>
  )
}

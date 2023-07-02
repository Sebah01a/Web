import './MainSite.css';
import React, { useState } from "react";
import GameAccess from './GameAccess';
import MainButton from './MainButton';
import { useParams } from 'react-router-dom';


export default function MainSite() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [playerId, setPlayerId] = useState(null); // Add playerId state
  const { userId } = useParams();

  const handleClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const buttonEvents = async () => {
    const createdPlayer = await createPlayer();
    setPlayerId(createdPlayer.id);
    ToggleStartGame();
    setTimeout(() => {
      handleClick();
    }, 200);
  };

  function ToggleStartGame() {
    setIsButtonClicked(true);
  }

  async function createPlayer() {
    try {
      const response = await fetch("http://localhost:3000/players/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="mainsite">
        <h1>¡Hora de jugar a UC Tycoon!</h1>
        <h3>¿Quieres ser tu propio jefe? En UC Tycoon lo puedes lograr. Compite contra otros estudiantes en salas de 2 a 4 jugadores. Compra facultades con tus creditos y aumenta tu patrimonio.</h3>
        <h3>Para esto deberas dar vueltas al tablero las veces que sean necesarias para aumentar tus facultades, subirlas de nivel y hacer que tus contrincantes te paguen.</h3>
        <h3>¡Se el primero en llegar a la meta de patrimonio!</h3>
        <MainButton onClick={buttonEvents} label="Jugar ahora" />
        {isButtonClicked && <GameAccess playerId={playerId} />}
      </div>
    </>
  );
}

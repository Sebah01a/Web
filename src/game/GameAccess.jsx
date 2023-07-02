import "./GameAccess.css";
import React, { useState } from "react";

export default function GameAccess({ playerId }) {
  const [gameIdInput, setGameIdInput] = useState("");

  const handleCreateGame = async () => {
    try {
      const response = await fetch("http://localhost:3000/games/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_player: playerId }),
      });
      const data = await response.json();
      const gameId = data.game.id;
      window.location.href = `/lobby/${gameId}/${playerId}`;
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await fetch(`http://localhost:3000/players/${gameIdInput}/player/${playerId}/join`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId: playerId }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = `/lobby/${gameIdInput}/${playerId}`;
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGameIdInputChange = (e) => {
    setGameIdInput(e.target.value);
  };

  return (
    <>
      <div className="container">
        <div className="small-cont">
          <h2 className="access-h2">Ingresa Código de Invitación</h2>
          <input type="text" value={gameIdInput} onChange={handleGameIdInputChange} />
          <button className="button-inv" onClick={handleJoinGame}>
            Ingresar a la partida
          </button>
        </div>
        <div className="small-cont">
          <button className="button-create" onClick={handleCreateGame}>
            Crear Sala
          </button>
        </div>
      </div>
    </>
  );
}

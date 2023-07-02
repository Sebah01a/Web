import React, { useState, useEffect } from 'react';
import './Lobby.css';
import { useParams } from 'react-router-dom';

export default function Lobby() {
    const { gameId, playerId } = useParams();

    const [playerStates, setPlayerStates] = useState({
        jugador1: false,
        jugador2: false,
        jugador3: false,
        jugador4: false,
    });
  const [playerUsernames, setPlayerUsernames] = useState([]);

    const [allPlayersReady, setAllPlayersReady] = useState(false);

    useEffect(() => {
        const checkAllPlayersReady = () => {
            const areAllPlayersReady = Object.values(playerStates).every(
                (state) => state === true
            );
            setAllPlayersReady(areAllPlayersReady);
            fetchPlayerStats(gameId);
        };

        checkAllPlayersReady();
    }, [playerStates, allPlayersReady]);

    const handleReadyClick = (player) => {
        setPlayerStates((prevState) => ({
            ...prevState,
            [player]: true,
        }));
    };
    const fetchPlayerStats = async (gameId) => {
        try {
          const response = await fetch(`http://localhost:3000/players/game/${gameId}`);
          const data = await response.json();
          const playerUsernames = data.playerUsernames
          console.log(playerUsernames)
          setPlayerUsernames(playerUsernames);
        } catch (error) {
          console.error('Error fetching player stats:', error);
        }
      };

const handleStartGame = async () => {
  try {
    const response = await fetch(`http://localhost:3000/games/check/${gameId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.exists) {
        window.location.href = `/board/${gameId}/${playerId}`;
      } else {
        const createGameResponse = await fetch(`http://localhost:3000/games/${gameId}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (createGameResponse.ok) {
          const createGameData = await createGameResponse.json();
          // Handle the game, board, squares, and players data as needed
          console.log(createGameData);
          window.location.href = `/board/${gameId}/${playerId}`;
        } else {
          // Handle the error response
          const error = await createGameResponse.json();
          console.error(error);
        }
      }
    } else {
      // Handle the error response
      const error = await response.json();
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

      

    return (
        <>
            <div className="empty-div"></div>
            <div className="bigcontainer">
                <div className="smallcontainer">
                    <h2 className="us-h2">{playerUsernames[0]}</h2>
                    <div className="placeholder"></div>
                    <button
                        className={`btn ${playerStates.jugador1 ? 'ready' : ''}`}
                        onClick={() => handleReadyClick('jugador1')}
                        disabled={playerStates.jugador1}
                    >
                        Listo
                    </button>
                </div>
                <div className="smallcontainer">
                    <h2 className="us-h2">{playerUsernames[1]}</h2>
                    <div className="placeholder"></div>
                    <button
                        className={`btn ${playerStates.jugador2 ? 'ready' : ''}`}
                        onClick={() => handleReadyClick('jugador2')}
                        disabled={playerStates.jugador2}
                    >
                        Listo
                    </button>
                </div>
            </div>
            {allPlayersReady && (
                <div className="buttoncontainer">
                    <button className="ready-button" onClick={handleStartGame}>
                        Start Game
                    </button>
                </div>
            )}
            <div className="bigcontainer">
                <div className="smallcontainer">
                    <h2 className="us-h2">{playerUsernames[2]}</h2>
                    <div className="placeholder"></div>
                    <button
                        className={`btn ${playerStates.jugador3 ? 'ready' : ''}`}
                        onClick={() => handleReadyClick('jugador3')}
                        disabled={playerStates.jugador3}
                    >
                        Listo
                    </button>
                </div>
                <div className="smallcontainer">
                    <h2 className="us-h2">{playerUsernames[3]}</h2>
                    <div className="placeholder"></div>
                    <button
                        className={`btn ${playerStates.jugador4 ? 'ready' : ''}`}
                        onClick={() => handleReadyClick('jugador4')}
                        disabled={playerStates.jugador4}
                    >
                        Listo
                    </button>
                </div>
            </div>

        </>
    );
}
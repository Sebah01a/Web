import './Board.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Board() {
  const { gameId, myPlayerId } = useParams();

  const [boardCells, setBoardCells] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [diceValue, setDiceValue] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [turnId, setTurnId] = useState(null);
  const [cambio, setCambio] = useState(null);
  const [playerUsernames, setPlayerUsernames] = useState([]);
  const [playerProperties, setPlayerProperties] = useState({});
  const [showWinner, setShowWinner] = useState(false);
  const [winnerName, setWinnerName] = useState(null);



  const calculatePropertyAndMover = (playerPosition) => {
    let mover = 0;
    let propertyActualIndex = 0;
    let casillabuena = 0;
    let casillamala = 0;
  
    if (playerPosition > 6 && playerPosition <= 11) {
      mover = playerPosition * 7 - 36;
      propertyActualIndex = playerPosition - 2;
    } else if (playerPosition > 12 && playerPosition <= 17) {
      mover = -playerPosition + 60;
      propertyActualIndex = playerPosition - 3;
    } else if (playerPosition > 18 && playerPosition <= 23) {
      mover = -7 * playerPosition + 168;
      propertyActualIndex = playerPosition - 4;
    } else if (playerPosition === 12) {
      mover = 48;
      casillabuena = 1;
    } else if (playerPosition === 6) {
      mover = 6;
      casillamala = 1;
    } else if (playerPosition === 18) {
      mover = 42;
      casillamala = 1;
    } else if (playerPosition > 0 && playerPosition <= 5) {
      mover = playerPosition;
      propertyActualIndex = playerPosition - 1;
    }
    else {
      propertyActualIndex = playerPosition;
    }
    return { propertyActualIndex, mover, casillabuena, casillamala};
  };

  useEffect(() => {

    fetch(`http://localhost:3000/properties/game/${gameId}`)
      .then((response) => response.json())
      .then((properties) => {
        if (properties.length === 0) {
          console.log('No properties found for the given game ID');
          return;
        }
  
        const cells = generateBoardCells(properties);
        setBoardCells(cells);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });
  
    fetchPlayerStats(gameId);
    const fetchData = async () => {
      const jugador_actual = await fetchTurnInfo(gameId);
      setCurrentPlayerName(jugador_actual);
    };
  
    fetchData();  

    getOwnedProperties(turnId);

    const winningPlayer = playerStats.find((player) => player.credits >= 1000);

    if (winningPlayer) {
      fetchPlayerName(winningPlayer.user_id);
    }

  }, [hoveredCell, diceValue, playerPosition, cambio]);

  
  const fetchPlayerStats = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:3000/players/game/${gameId}`);
      const data = await response.json();
      const playerStats = data.players;
      const playerUsernames = data.playerUsernames
      setPlayerStats(playerStats);
      setPlayerUsernames(playerUsernames);
    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  };

  const fetchPlayerName = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWinnerName(data.username);
        setShowWinner(true);
      } else {
        const error = await response.text();
        console.error('Failed to fetch player name:', error);
      }
    } catch (error) {
      console.error('Error fetching player name:', error);
    }
  };

  const handleCellHover = (property) => {
    if (property) {
      setHoveredCell(property);
    } else {
      setHoveredCell(null);
    }
    setCambio(0);

  };

  const handleThrowDice = async () => {
    try {
      const response = await fetch(`http://localhost:3000/players/${turnId}/throw-dice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const { position, diceValue} = data;
  
        setDiceValue(diceValue); // Actualizar el valor del dado en el estado
  
        const updatedPlayerStats = playerStats.map((player) => {
          if (player.id === turnId) { // Reemplaza 4 con el ID del jugador correspondiente
            return { ...player, position }; // Actualizar la posición del jugador
          }
          return player;
        });
  
        setPlayerStats(updatedPlayerStats); // Actualizar el estado con las posiciones actualizadas de los jugadores
      } else {
        console.error('Failed to throw dice:', response.status);
      }
    } catch (error) {
      console.error('Error throwing dice:', error);
    }
    setCambio(0);
  };

  const handleBuyProperty = async (propertyName) => {
    
    try {
      const response = await fetch('http://localhost:3000/properties/buy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: turnId, game_id: gameId, property_name: propertyName }),
      });
  
      if (response.ok) {
        console.log('Property bought successfully');
      } else {
        const data = await response.json();
        console.error('Failed to buy property:', data);
      }
    } catch (error) {
      console.error('Error buying property:', error);
    }
    setCambio(0);
  };

  const handlePayProperty = async (propertyName) => {
    
    try {
      const response = await fetch('http://localhost:3000/properties/pay', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: turnId, gameId: gameId, propertyName: propertyName }),
      });
  
      if (response.ok) {
        console.log('Property pay successfully');
      } else {
        const data = await response.json();
        console.error('Failed to pay property:', data);
      }
    } catch (error) {
      console.error('Error buying property:', error);
    }
    setCambio(0);
  };
  
  

  const handleEndTurn = async () => {
    try {
      const response = await fetch(`http://localhost:3000/games/${gameId}/next-turn`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        // Handle successful turn change
        console.log('Turn changed successfully');
      } else {
        // Handle error response
        const data = await response.json();
        console.error('Failed to change turn:', data);
      }
    } catch (error) {
      console.error('Error changing turn:', error);
    }
    setCambio(0);

  };

  const handleAddCredits = async () => {
  
    try {
      const response = await fetch('http://localhost:3000/players/add-credits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: turnId }),
      });
  
      if (response.ok) {
        // Handle successful addition of credits
        console.log('Credits added successfully');
      } else {
        // Handle error response
        const data = await response.json();
        console.error('Failed to add credits:', data);
      }
    } catch (error) {
      console.error('Error adding credits:', error);
    }

  };

  const handleClearOwners = async () => {
    try {

      const response = await fetch('http://localhost:3000/properties/clear-owners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: gameId }),
      });

      if (response.ok) {
        console.log('Property owners cleared successfully');
      } else {
        const data = await response.json();
        console.error('Failed to clear property owners:', data);
      }
    } catch (error) {
      console.error('Error clearing property owners:', error);
    }
    setCambio(0);

  };

  const handleDestinyCredits = async () => {// Pasarle una palabra para que backend vea si resta o suma
    let destino = "";
    if (playerPosition === 6 || playerPosition === 18) {
      destino = "malo";
    }
    else if (playerPosition === 12) {
      destino = "bueno";
    }

    try {
      const response = await fetch(`http://localhost:3000/players/destiny-credits/${turnId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destino: destino }),
      });
      if (response.ok) {
        const data = await response.json();
        const amount = data.amount;
  
        setPlayerStats((prevPlayerStats) =>
          prevPlayerStats.map((player) => {
            if (player.id === turnId) {
              if (destino === "malo") {
                return { ...player, credits: player.credits - amount };
              }
              else if (destino === "bueno") {
                return { ...player, credits: player.credits + amount };
              }
            }
            return player;
          })
        );
        
      } else {
        console.error('Failed to change credits:', response.status);
      }
    } catch (error) {
      console.error('Error change credits:', error);
    }
    handleEndTurn();
  };
  


  const fetchTurnInfo = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:3000/games/${gameId}/turn-info`);
      const data = await response.json();
      const turnId = data.turnId;
      const user = data.user;
      const diceValue = data.diceValue;
      const currentPlayer = data.currentPlayer;
      setTurnId(turnId);
      setCurrentPlayer(currentPlayer);
      setPlayerPosition(currentPlayer.position)
      return user.username;
    } catch (error) {
      console.error("Error fetching turn info:", error);
    }
    setCambio(0);
  };


  async function getOwnedProperties(playerId) {
    try {
      const response = await fetch(`http://localhost:3000/properties/owned-by/${playerId}`);
      if (response.ok) {
        const data = await response.json();
        const properties = data.properties;
  
        // Check if properties already exist in the list
        const existingProperties = playerProperties[playerId] || [];
        const newProperties = properties.filter(
          (property) => !existingProperties.some((p) => p.id === property.id)
        );
  
        // Add new properties to the list
        if (newProperties.length > 0) {
          setPlayerProperties((prevState) => ({
            ...prevState,
            [playerId]: [...existingProperties, ...newProperties],
          }));
        }
      } else {
        const error = await response.text();
        console.error("Failed to get owned properties:", error);
      }
    } catch (error) {
      console.error("Error getting owned properties:", error);
    }
  }
  
  
  

  const generateBoardCells = (properties) => {
    const sortedProperties = properties.sort((a, b) => a.square_id - b.square_id);
    const boardSize = 7; // Size of the board
    const totalCells = boardSize * boardSize;
    const cells = Array(totalCells).fill(null);

    let propertyIndex = 0; // Counter for properties
    let newcellIndex = 0;
    let cellIndex = 1;

    cells[0] = (
      <div key={0} className="square-inicio" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        0 <br /> Inicio <br />
      </div>
    );

    for (propertyIndex; propertyIndex < 5; propertyIndex++) {
      const property = sortedProperties[propertyIndex];
      cells[cellIndex] = (
        <div
          key={cellIndex}
          className={`square-${property.name}`}
          onMouseEnter={() => handleCellHover(property)}
          onMouseLeave={() => handleCellHover(null)}
        >
          {propertyIndex + 1} <br /> {property.name}
        </div>
      );
      cellIndex++;
    }

    cells[6] = (
      <div key={6} className="square-malo" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        6 <br /> - 10% de tus creditos
      </div>
    );

    for (propertyIndex; propertyIndex < 10; propertyIndex++) {
      const property = sortedProperties[propertyIndex];
      newcellIndex = (propertyIndex - 5) * 7 + 13;

      cells[newcellIndex] = (
        <div
          key={newcellIndex}
          className={`square-${property.name}`}
          onMouseEnter={() => handleCellHover(property)}
          onMouseLeave={() => setHoveredCell(null)}
        >
          {propertyIndex + 2} <br /> {property.name}
        </div>
      );
    }

    cells[48] = (
      <div key={48} className="square-bueno" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        12 <br /> + 10% de tus creditos
      </div>
    );

    for (propertyIndex; propertyIndex < 15; propertyIndex++) {
      const property = sortedProperties[propertyIndex];
      newcellIndex = 49 - propertyIndex + 8;

      cells[newcellIndex] = (
        <div
          key={newcellIndex}
          className={`square-${property.name}`}
          onMouseEnter={() => handleCellHover(property)}
          onMouseLeave={() => setHoveredCell(null)}
        >

          {propertyIndex + 3} <br /> {property.name}
        </div>
      );
    }

    cells[42] = (
      <div key={42} className="square-malo" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        18 <br /> - 10% de tus creditos
      </div>
    );

    for (propertyIndex; propertyIndex < 20; propertyIndex++) {
      const property = sortedProperties[propertyIndex];
      newcellIndex = 35 - (propertyIndex - 15) * 7;

      cells[newcellIndex] = (
        <div
          key={newcellIndex}
          className={`square-${property.name}`}
          onMouseEnter={() => handleCellHover(property)}
          onMouseLeave={() => setHoveredCell(null)}
        >
          {propertyIndex + 4} <br /> {property.name}
        </div>
      );
    }


    const { propertyActualIndex, mover, casillabuena, casillamala} = calculatePropertyAndMover(playerPosition);
    setCambio(1);

    cells[10] = (
      <div key={10} className="jugador-actual" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        Turno de: <br /> {currentPlayerName}
      </div>
    );

    cells[36] = (
      <div key={36} className="accept-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        {parseInt(myPlayerId) === turnId ? (
          <button onClick={() => handleDestinyCredits()}>Aceptar destino</button>
        ) : null}
      </div>
    );
    

    cells[37] = (
      <div key={37} className="buy-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        {parseInt(myPlayerId) === turnId ? (
          <button onClick={() => handleBuyProperty(sortedProperties[propertyActualIndex].name)}>Comprar propiedad</button>
        ) : null}

      </div>
    );

    // Botones para hacer trampa
    // cells[29] = (
    //   <div key={29} className="buy-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
    //         <button onClick={handleAddCredits}>Add 1000 Credits</button>
    //         <button onClick={handleClearOwners}>Clear Property Owners</button>
    //   </div>
    // );

    cells[39] = (
      <div key={39} className="pay-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
      {parseInt(myPlayerId) === turnId ? (
        <button onClick={() => handlePayProperty(sortedProperties[propertyActualIndex].name)}>Pagar a dueño</button>
      ) : null}

      </div>
    );

    cells[40] = (
      <div key={40} className="turn-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        {parseInt(myPlayerId) === turnId ? (
          <button onClick={handleEndTurn}>Terminar turno</button>
        ) : null}
      </div>
    );

    cells[24] = (
      <div className='logo-center' onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}></div>
    );

    cells[38] = (
      <div key={38} className="dice-button" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        {parseInt(myPlayerId) === turnId ? (
          <button onClick={handleThrowDice}>Lanzar dado</button>
        ) : null}
      </div>
    );

    cells[31] = (
      <div key={31} className="dice-number" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
        <br />
        {diceValue}
      </div>
    );

    cells[17] = (
      <div
        key={17}
        className={`square-info`}
        onMouseEnter={() => handleCellHover(null)}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {hoveredCell && (
          <div>
            {hoveredCell.name} <br /> Precio: {hoveredCell.price} <br /> Nivel: {hoveredCell.level}
          </div>
        )}
      </div>
    );



    const propiedadDiv = cells[mover];
    if (playerPosition === 0) {
      cells[0] = (
        <div key={0} className="square-inicio" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
          {playerPosition}    
          <br />
          Inicio
          <br />          
          <br />
          <img src="../src/assets/imgs/red_circle.png" alt="Player" className="player-image" />
        </div>
      );
    }
    
    else if (!casillamala && !casillabuena) {
      cells[mover] = (
        <div key={mover} className= {propiedadDiv.props.className} onMouseEnter={() => handleCellHover(sortedProperties[propertyActualIndex])} onMouseLeave={() => setHoveredCell(null)}>
          <br />
          {playerPosition}
          <div >{propiedadDiv.props.className.slice(7)}</div>
          <img src="../src/assets/imgs/red_circle.png" alt="Player" className="player-image" />
        </div>
      );
    }
    else if (casillabuena) {
      cells[mover] = (
        <div key={mover} className="square-bueno" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
          {playerPosition}
          <br />
          + 10%
          <br />
          <br />
          <img src="../src/assets/imgs/red_circle.png" alt="Player" className="player-image" />
        </div>
      );
    }
    else if (casillamala) {
      cells[mover] = (
        <div key={mover} className="square-malo" onMouseEnter={() => handleCellHover(null)} onMouseLeave={() => setHoveredCell(null)}>
          {playerPosition}    
          <br />
          -10 %
          <br />          
          <br />
          <img src="../src/assets/imgs/red_circle.png" alt="Player" className="player-image" />
        </div>
      );
    }

    return cells;
  };

  const renderPlayerStats = () => {
    return (
      <div className="player-stats-container">
        {playerStats.map((player, index) => {
          const playerId = player.id;
          const properties = playerProperties[playerId] || [];
  
          return (
            <div className="player-stat" key={player.id}>
              <div>Player Name: {playerUsernames[index]}</div>
              <div>Credits: {player.credits}</div>
              <div>Position: {player.position}</div>
              <div>
                Propiedades:
                <ul>
                  {properties.map((property) => (
                    <li key={`${playerId}-${property.id}`}>{property.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
    

  // const renderPlayerStats2 = () => {
  //   return (
  //     <div className="player-stats-container">
  //         <div className="player-stat" key={playerUsernames[0]}>
  //           <div>Player Name: {playerUsernames[0]}</div>
  //           <div>Credits: {player.credits}</div>
  //           <div>Position: {player.position}</div>
  //           <div>Color: {player.token}</div>
  //         </div>
  //     </div>
  //   );
  // };


  // const renderPlayerStats3 = () => {
  //   const lastTwoPlayers = playerStats.slice(2);
  //   return (
  //     <div className="player-stats-container">
  //       {lastTwoPlayers.map((player) => (
  //         <div className="player-stat" key={player.id}>
  //           <div>Player Name: {player.name}</div>
  //           <div>Credits: {player.credits}</div>
  //           <div>Position: {player.position}</div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div className="game-container">
      {showWinner && (
        <div className="winner-container">
          <div className="winner-message">Winner: {winnerName}</div>
        </div>
      )}
      {renderPlayerStats()}
      <div className="board-container">
        {boardCells.map((cell, index) => (
          <div
            key={index}
            className={`board-cell-${hoveredCell && hoveredCell.square_id === index ? 'hovered' : ''}`}
            onMouseEnter={() => handleCellHover(cell)}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}

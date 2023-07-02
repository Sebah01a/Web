import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Instructions from '../game/Instructions';
import Login from '../profile/Login';
import AboutUs from '../aboutus/AboutUs';
import MainSite from '../game/MainSite';
import Lobby from "../game/for-real-game/Lobby";
import Board from '../game/for-real-game/Board';
import Register from "../profile/Register";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/board/:gameId/:myPlayerId" element={<Board />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/mainsite/:userId" element={<MainSite />} />
        <Route path="/lobby/:gameId/:playerId" element={<Lobby />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default Routing
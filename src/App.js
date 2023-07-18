import React, { useReducer } from "react";
import Balloon from './Balloon';
import Player from './components/Player';
import Merchant from "./components/Merchant";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Balloon />} />
        <Route path="/player" element={<Player />} />
        <Route path="/merchant" element={<Merchant />} />
      </Routes>
    </Router>
  );
}


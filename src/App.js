import React, { useReducer } from "react";
import Balloon from './Balloon';
import Player from './components/Player';
import Merchant from "./components/Merchant";
import Missing from "./components/Missing";
import Unauthorized from './components/Unauthrized';
import RequireAuth from './components/RequireAuth';
import Login from "./components/Login";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { AuthProvider } from "./context/AuthProvider";

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

export default function App() {

  return (
    <Router>
      <AuthProvider>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Balloon />} />
        <Route path="/player" element={<Player />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="login" element={<Login />} />
        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/merchant" element={<Merchant />} />
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}


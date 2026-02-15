import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !authToken ? (
              <Auth setAuthToken={setAuthToken} />
            ) : (
              <Navigate to="/chat" />
            )
          }
        />
        <Route
          path="/chat"
          element={authToken ? <Chat /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

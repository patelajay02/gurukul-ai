import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { db, createDemoUser } from "./database";
import Login from "./Login";
import Register from "./Register";
import App from "./App";

function Root() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    createDemoUser();
    const current = db.getCurrentUser();
    if (current) {
      setUser(current);
      setScreen("app");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen("app");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setScreen("app");
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setScreen("login");
  };

  if (screen === "login") return <Login onLogin={handleLogin} onRegister={() => setScreen("register")} />;
  if (screen === "register") return <Register onRegister={handleRegister} onLogin={() => setScreen("login")} />;
  if (screen === "app") return <App user={user} onLogout={handleLogout} />;
}

createRoot(document.getElementById("root")).render(<Root />);

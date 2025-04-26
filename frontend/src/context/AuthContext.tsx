import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


type AuthContextType = {
  token: string | null;
  user: any | null;
  isLoggedIn: boolean;
  setLogin: (token: string, user: any) => void;
  setLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoggedIn: false,
  setLogin: () => {},
  setLogout: () => {},
});

//DOCU: Each time that the app is loaded, it will set the initial state of the token, user and isLoggedIn.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!token);

  const setLogin = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
  }

  const setLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    
    // Optionally, you can also redirect the user to the login page or home page
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, setLogin, setLogout }}>
    { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
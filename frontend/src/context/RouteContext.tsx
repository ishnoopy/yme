import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type RouteContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const RouteContext = createContext<RouteContextType>({
  currentPage: "home",
  setCurrentPage: () => {},
});

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("home");
  const location = useLocation();

  // Automatically update currentPage when route changes
  useEffect(() => {
    // Remove the leading '/' and use the path as the current page
    // If path is empty (just '/'), use 'home'
    const newPage = location.pathname.slice(1) || "home";
    setCurrentPage(newPage);
  }, [location.pathname]);

  return (
    <RouteContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};

export default RouteContext;
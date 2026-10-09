import './App.css'

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [dark, setDark] = useLocalStorage("dark", false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Routes>
      <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
      <Route
        path="/movie/:id"
        element={<MovieDetails dark={dark} setDark={setDark} />}
      />
    </Routes>
  );
}
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import useLocalStorage from "../hooks/useLocalStorage";
import { fetchMovies } from "../api";

export default function Home({ dark, setDark }) {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFavs, setShowFavs] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      fetchMovies(query.trim())
        .then((data) => {
          setMovies(data);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const toggleFav = (movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const list = showFavs ? favorites : movies;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white">
      <nav className="bg-white dark:bg-gray-900 shadow px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-blue-600">🍿 CineWorld</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 min-w-[180px] max-w-md px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowFavs(!showFavs)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {showFavs ? "All Movies" : `❤️ Favorites (${favorites.length})`}
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          {showFavs ? "My Favorites" : query ? `Results for "${query}"` : "Trending This Week"}
        </h2>

        {loading && !showFavs && <p>Loading...</p>}
        {error && !showFavs && <p className="text-red-500">{error}</p>}
        {!loading && list.length === 0 && <p>No movies found.</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {list.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFav={favorites.some((m) => m.id === movie.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
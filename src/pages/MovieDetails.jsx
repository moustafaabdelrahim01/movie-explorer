import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetails } from "../api";
import useLocalStorage from "../hooks/useLocalStorage";

export default function MovieDetails({ dark, setDark }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  useEffect(() => {
    setLoading(true);
    fetchMovieDetails(id)
      .then((data) => {
        setMovie(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isFav = favorites.some((m) => m.id === Number(id));

  const toggleFav = () => {
    setFavorites((prev) =>
      isFav ? prev.filter((m) => m.id !== movie.id) : [...prev, movie]
    );
  };

  if (loading) return <p className="p-4 dark:text-white">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  const trailer = movie.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white">
      <nav className="bg-white dark:bg-gray-900 shadow px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-blue-600 font-bold">
          ← Back to movies
        </Link>
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={poster}
            alt={movie.title}
            className="w-full md:w-72 rounded-xl shadow"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {movie.release_date?.slice(0, 4)} • {movie.runtime} min
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-yellow-500 text-lg mt-3">
              ⭐ {movie.vote_average.toFixed(1)}
            </p>

            <p className="mt-4 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>

            <button
              onClick={toggleFav}
              className="mt-5 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {isFav ? "❤️ Remove from favorites" : "🤍 Add to favorites"}
            </button>
          </div>
        </div>

        {trailer && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Trailer</h2>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
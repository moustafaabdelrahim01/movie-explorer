import { Link } from "react-router-dom";

export default function MovieCard({ movie, isFav, onToggleFav }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:scale-105 transition">
      <Link to={`/movie/${movie.id}`}>
        <img src={poster} alt={movie.title} className="w-full" />
      </Link>
      <div className="p-3 flex justify-between items-center gap-2">
        <div>
          <Link
            to={`/movie/${movie.id}`}
            className="font-bold dark:text-white hover:text-blue-600"
          >
            {movie.title}
          </Link>
          <p className="text-yellow-500">⭐ {movie.vote_average?.toFixed(1)}</p>
        </div>
        <button onClick={() => onToggleFav(movie)} className="text-2xl">
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
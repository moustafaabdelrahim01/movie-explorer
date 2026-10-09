const KEY = import.meta.env.VITE_TMDB_KEY;
const BASE = "https://api.themoviedb.org/3";

export async function fetchMovies(query = "") {
  const url = query
    ? `${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(query)}`
    : `${BASE}/trending/movie/week?api_key=${KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch movies");
  const data = await res.json();
  return data.results;
}
export async function fetchMovieDetails(id) {
  const res = await fetch(
    `${BASE}/movie/${id}?api_key=${KEY}&append_to_response=videos`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}
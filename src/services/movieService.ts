import axios from "axios";
import { type Movie } from "../types/movie";

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TMDB_TOKEN) {
  throw new Error("VITE_TMDB_TOKEN is not set in environment variables.");
}
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieResponse> => {
  try {
    const endpoint = query ? "search/movie" : "trending/movie/day";

    const params: { query?: string; page: number } = { page };

    if (query) {
      params.query = query;
    }

    const { data } = await instance.get<MovieResponse>(endpoint, { params });

    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Не вдалося завантажити фільми з TMDB.");
  }
};

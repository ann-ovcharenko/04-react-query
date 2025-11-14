import axios from "axios";
import { type Movie } from "../types/movie.ts";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const BASE_URL = "https://api.themoviedb.org/3";

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string = ""): Promise<Movie[]> {
  if (!TMDB_TOKEN) {
    console.error(
      "TMDB Token is missing. Please set VITE_TMDB_TOKEN in your .env file."
    );
    return [];
  }

  const endpoint = query ? "/search/movie" : "/movie/popular";

  const config = {
    params: {
      language: "uk-UA",
      ...(query && { query: query }),
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<MoviesResponse>(
      `${BASE_URL}${endpoint}`,
      config
    );

    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Помилка отримання фільмів: ${error.response?.status} - ${error.message}`,
        error.response?.data
      );
    } else {
      console.error("Невідома помилка при отриманні фільмів:", error);
    }
    return [];
  }
}

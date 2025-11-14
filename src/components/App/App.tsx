import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { type Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import styles from "./App.module.css";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchSubmit = (query: string) => {
    setMovies([]);
    setSearchQuery(query);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedMovies = await fetchMovies(searchQuery);

        if (fetchedMovies.length === 0) {
          toast.error("No movies found for your request.");
        }

        setMovies(fetchedMovies);
      } catch (err) {
        console.error("Помилка в компоненті App:", err);
        setError("HTTP Error occurred. Please check console for details.");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [searchQuery]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;

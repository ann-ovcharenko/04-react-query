import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { type Movie } from "../../types/movie";
import { fetchMovies, type MovieResponse } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import styles from "./App.module.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery<
    MovieResponse,
    Error
  >({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.length > 0,
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (isError && error) {
      const errorMessage = (error as Error).message;
      toast.error(`Критична помилка запиту: ${errorMessage}`);
    }
    if (!isError && data && data.results.length === 0 && searchQuery !== "") {
      toast.error("No movies found for your request.");
    }
  }, [isError, error, data, searchQuery]);
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearchSubmit = (query: string) => {
    setPage(1);
    setSearchQuery(query);
    handleModalClose();
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const showLoader = isLoading || (isFetching && movies.length === 0);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearchSubmit} />

      {showLoader && <Loader />}
      {isError && <ErrorMessage />}
      {!showLoader && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}

      {!showLoader && !isError && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;

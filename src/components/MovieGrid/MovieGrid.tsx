import { type Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div className={styles.card} onClick={() => onSelect(movie)}>
            {movie.poster_path ? (
              <img
                src={`${POSTER_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className={styles.image}
                loading="lazy"
              />
            ) : (
              <div
                className={styles.image}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#333",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Постер недоступний
              </div>
            )}
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;

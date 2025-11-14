import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { type Movie } from "../../types/movie";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const modalRoot = document.getElementById("modal-root");
if (!modalRoot) {
  throw new Error('Element with id "modal-root" not found in the document.');
}

const MovieModalContent = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const releaseYear = movie.release_date ? movie.release_date : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {movie.backdrop_path ? (
          <img
            src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            className={styles.image}
          />
        ) : (
          <div
            className={styles.image}
            style={{
              backgroundColor: "#111",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Зображення недоступне
          </div>
        )}

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "Опис фільму відсутній."}</p>
          <p>
            <strong>Release Date:</strong> {releaseYear}
          </p>
          <p>
            <strong>Rating:</strong> {rating}/10
          </p>
        </div>
      </div>
    </div>
  );
};

const MovieModal = (props: MovieModalProps) => {
  return createPortal(<MovieModalContent {...props} />, modalRoot!);
};

export default MovieModal;

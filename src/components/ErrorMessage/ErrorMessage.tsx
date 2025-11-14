import styles from "./ErrorMessage.module.css";

const ErrorMessage = () => {
  return (
    <p role="alert" className={styles.text}>
      There was an error, please try again...
    </p>
  );
};

export default ErrorMessage;

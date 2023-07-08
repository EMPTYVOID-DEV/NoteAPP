import styles from "./error.module.css";
import { useLocation, useNavigate } from "react-router";

export default function ErrorHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.error}>
      <img
        src={location.state ? "../../assets/503.jpg" : "../../assets/404.jpg"}
      />
      <div>
        <h1>Something went wrong</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

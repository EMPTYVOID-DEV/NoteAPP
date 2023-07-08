import styles from "./error.module.css";
import { useLocation, useNavigate } from "react-router";
import img503 from "../../assets/503.jpg";
import img404 from "../../assets/404.jpg";

export default function ErrorHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.error}>
      <img src={location.state ? img503 : img404} />
      <div>
        <h1>{location.state ? "Service unavailable" : "Page not found"}</h1>

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

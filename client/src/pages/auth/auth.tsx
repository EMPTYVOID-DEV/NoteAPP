import { FormEvent, useRef, useState } from "react";
import styles from "./auth.module.css";
import { authenicate } from "../../utils/apiFunctions";
import { useTokenStore } from "../../utils/zustandStore";
import { useNavigate } from "react-router-dom";
import { passwordChecker, emailChecker } from "../../utils/regularFucntions";
import PasswordStrength from "./passwordStrength";
type phase = "form" | "login" | "register";

export default function Auth() {
  const [authorizePhase, changePhase] = useState<phase>("form");
  const update = useTokenStore((state) => state.update);
  const [errorMessage, SetError] = useState("no error");
  const [passwordStrength, changeStrength] = useState<number>(0);
  const userInfo = useRef({ email: "", password: "" });
  const navagate = useNavigate();

  const formHandler = async (e: FormEvent, islogin: boolean) => {
    e.preventDefault();
    if (errorMessage === "Email is not valid" || passwordStrength < 3) return;
    changeStrength(5);
    const res = await authenicate(
      userInfo.current.email,
      userInfo.current.password,
      islogin
    );
    if (res.status === 200) {
      update(res.message);
      navagate("/home");
    } else if (res.status === 503 || res.status === 400) {
      navagate("/auth");
    } else {
      SetError(res.message);
    }
  };
  const FormView =
    authorizePhase === "form" ? (
      <div className={styles.form}>
        <button
          onClick={() => {
            changePhase("register");
          }}
        >
          Create New Account
        </button>
        <span>Or</span>
        <button
          onClick={() => {
            changePhase("login");
          }}
        >
          Login into Existing Account{" "}
        </button>
      </div>
    ) : authorizePhase === "login" ? (
      <form className={styles.login}>
        <input
          type="email"
          required
          placeholder="email"
          defaultValue={userInfo.current.email}
          onChange={(e) => {
            userInfo.current.email = e.target.value;
            if (!emailChecker(e.target.value)) SetError("Email is not valid");
            else {
              SetError("no error");
            }
          }}
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="password"
          defaultValue={userInfo.current.password}
          onChange={(e) => {
            userInfo.current.password = e.target.value;
          }}
        />
        {errorMessage !== "no error" ? (
          <div className={styles.error}>
            <i className="fas fa-exclamation-triangle"></i>
            {errorMessage}
          </div>
        ) : null}
        <div>
          <button onClick={(e) => formHandler(e, true)}>Login in</button>
          <span>
            new user?
            <span
              onClick={() => {
                changePhase("register");
              }}
            >
              try register in
            </span>
          </span>
        </div>
      </form>
    ) : (
      <form className={styles.register}>
        <input
          type="email"
          required
          placeholder="email"
          defaultValue={userInfo.current.email}
          onChange={(e) => {
            userInfo.current.email = e.target.value;
            if (!emailChecker(e.target.value)) SetError("Email is not valid");
            else {
              SetError("no error");
            }
          }}
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="password"
          defaultValue={userInfo.current.password}
          onChange={(e) => {
            userInfo.current.password = e.target.value;
            changeStrength(passwordChecker(e.target.value));
          }}
        />
        <PasswordStrength passwordStrength={passwordStrength} />
        {errorMessage !== "no error" ? (
          <div className={styles.error}>
            <i className="fas fa-exclamation-triangle"></i>
            {errorMessage}
          </div>
        ) : null}
        <div>
          <button onClick={(e) => formHandler(e, false)}>Sign Up</button>
          <span>
            already have an account?
            <span
              onClick={() => {
                changePhase("login");
              }}
            >
              try login
            </span>
          </span>
        </div>
      </form>
    );
  return (
    <div className={styles.auth}>
      <div className={styles.rightside}>
        <span className={styles.header}>NoteAble </span>
        {authorizePhase === "form" && (
          <span className={styles.header}>
            Note Your Life freely and Perfectly
          </span>
        )}
        {FormView}
      </div>
      <div className={styles.leftside}>
        <div className={styles.img}></div>
        <div className={styles.overlay}></div>
      </div>
    </div>
  );
}

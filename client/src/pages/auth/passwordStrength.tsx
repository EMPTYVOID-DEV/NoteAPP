import styles from "./auth.module.css";
const passwordStrengthUi = ["Very Weak", "Weak", "Medium", "Good", "Strong"];

export default function PasswordStrength({
  passwordStrength,
}: {
  passwordStrength: number;
}) {
  return (
    <div
      className={styles.passwordStrength}
      style={{
        display: passwordStrength === 5 ? "none" : "inline-block",
      }}
    >
      <div>
        <div
          style={{
            display: passwordStrength < 1 ? "none" : "inline-block",
          }}
        ></div>
        <div
          style={{
            display: passwordStrength < 2 ? "none" : "inline-block",
          }}
        ></div>
        <div
          style={{
            display: passwordStrength < 3 ? "none" : "inline-block",
          }}
        ></div>
        <div
          style={{
            display: passwordStrength < 4 ? "none" : "inline-block",
          }}
        ></div>
      </div>
      <span>{passwordStrengthUi[passwordStrength]}</span>
    </div>
  );
}

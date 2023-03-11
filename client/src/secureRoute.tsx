import { useTokenStore } from "./utils/zustandStore";
import { Navigate, Outlet } from "react-router-dom";
export default function SecureRoute() {
  const token = useTokenStore((state) => state.token);

  return token !== "" ? <Outlet /> : <Navigate to="/" />;
}

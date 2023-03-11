import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Auth from "./pages/auth/auth";
import Loading from "./pages/loading/Loading";
import { useTokenStore } from "./utils/zustandStore";
export default function Intial() {
  const [isError, SetError] = useState(false);
  const [isLoading, SetLoading] = useState(true);
  const update = useTokenStore((state) => state.update);
  const location = useLocation();
  const intialFetch = async () => {
    let res: any;
    try {
      res = await axios.get("/api/auth/refresh", { withCredentials: true });
    } catch (error) {
      return SetError(true);
    }
    let newtoken: string = res.headers["authentication"];
    update(newtoken);
    SetLoading(false);
  };

  useEffect(() => {
    let check = location.state;
    if (check) SetError(true);
    else intialFetch();
  }, []);

  if (isError) return <Auth />;
  if (isLoading) return <Loading />;
  return <Navigate to="/home" />;
}

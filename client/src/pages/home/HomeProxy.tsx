import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTagStore,
  useNoteStore,
  useTokenStore,
} from "../../utils/zustandStore";
import Home from "./Home";
import Loading from "../loading/Loading";
import { refreshToken, getNotes } from "../../utils/apiFunctions";

export default function HomeProxy() {
  const navigate = useNavigate();
  const [isLoading, SetLoading] = useState(true);
  const state = useTokenStore((state) => state);
  const [intailnotes] = useNoteStore((state) => [state.intail]);
  const [intailtags] = useTagStore((state) => [state.intail]);
  const intialFetch = async () => {
    const token = await refreshToken(
      navigate,
      state.hasExpired,
      state.update,
      state.token
    );
    if (token) {
      await getNotes(intailnotes, intailtags, token, navigate);
      SetLoading(false);
    }
  };

  useEffect(() => {
    intialFetch();
  }, []);

  if (isLoading) return <Loading />;
  return <Home />;
}

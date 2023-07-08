import axios from "axios";
import { note } from "./types";

axios.defaults.withCredentials = true;

type res = {
  message: string;
  status: number;
};

export const authenicate: (
  e: string,
  pa: string,
  isl: boolean
) => Promise<res> = async (
  email: string,
  password: string,
  isLogin: boolean
) => {
  try {
    const response = await axios.post(
      `/api/auth/${isLogin ? "login" : "register"}`,
      {
        email,
        password,
      }
    );
    return { status: 200, message: response.headers["authentication"] };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response?.status)
        return { message: "Network error", status: 405 };

      if (error.response?.status === 503)
        return { status: 503, message: "Database is down" };
      if (error.response?.status === 404)
        return {
          message: `${isLogin ? "User not found" : "user already exist"}`,
          status: 404,
        };
      if (error.response?.status === 403)
        return { message: "Password is incorrect", status: 403 };
    }
    return { message: "other error", status: 400 };
  }
};

export const refreshToken = async (
  navigate: any,
  hasExpired: () => boolean,
  update: (val: string) => void,
  token: string
) => {
  let newtoken: string = token;
  if (hasExpired()) {
    try {
      const res = await axios.get("/api/auth/refresh");
      newtoken = res.headers["authentication"];
      console.log(newtoken)
      update(newtoken);
    } catch (error) {
      navigate("/", { state: true });
      return null;
    }
  }
  return newtoken;
};

export const getNotes = async (
  noteIntail: (notes: Map<string, note>) => void,
  tagIntail: (tags: Map<string, string>) => void,
  token: string,
  navigate: any
) => {
  try {
    const res = await axios.get("/api/user", {
      headers: { authentication: `bearer ${token}` },
    });
    const data = res.data;
    noteIntail(new Map(Object.entries(data.notes)));
    tagIntail(new Map(Object.entries(data.tags)));
  } catch (error) {
    navigate("/503", { state: true });
  }
};
export const apiNoteUpdateorCreate = async (
  token: string,
  navigate: any,
  noteid: string,
  note: note,
  img: File | null
) => {
  let fd = new FormData();
  fd.append("id", noteid);
  fd.append("note", JSON.stringify(note));
  if (img !== null) fd.append("image", img, note.ImagePath);
  try {
    await axios.post("/api/user/note", fd, {
      headers: {
        authentication: `bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    });
  } catch (error) {
    navigate("/503", { state: true });
  }
};
export const apiTagUpdateOrCreate = async (
  val: string,
  key: string,
  token: string,
  navigate: any
) => {
  try {
    await axios.post(
      "/api/user/tag",
      { key, val },
      {
        headers: { authentication: `bearer ${token}` },
      }
    );
  } catch (error) {
    navigate("/503", { state: true });
  }
};
export const apiTagDelete = async (
  delet: (key: string) => void,
  key: string,
  token: string,
  navigate: any
) => {
  try {
    await axios.delete(`/api/user/tag/${key}`, {
      headers: { authentication: `bearer ${token}` },
    });
    delet(key);
  } catch (error) {
    navigate("/503", { state: true });
  }
};
export const apiNoteDelete = async (
  delet: (key: string) => void,
  noteid: string,
  token: string,
  navigate: any
) => {
  try {
    await axios.delete(`/api/user/note/${noteid}`, {
      headers: { authentication: `bearer ${token}` },
    });
  } catch (error) {
    navigate("/503", { state: true });
  }
};

export const ReplaceTags = async (
  newtags: Map<string, string>,
  token: string,
  navigate: any
) => {
  try {
    await axios.post(
      "/api/user/tags",
      {
        Tags: Object.fromEntries(newtags),
      },
      {
        headers: { authentication: `bearer ${token}` },
      }
    );
    navigate(0);
  } catch (error) {
    navigate("/503", { state: true });
  }
};

import { useNavigate, useParams } from "react-router";
import {
  useNoteStore,
  useTagStore,
  useTokenStore,
} from "../../utils/zustandStore";
import style from "./showNote.module.css";
import { apiNoteDelete, refreshToken } from "../../utils/apiFunctions";
import { NoteTagMapper } from "../../utils/regularFucntions";

export default function ShowNote() {
  let { id } = useParams();
  let [note, delet] = useNoteStore((state) => [
    state.search(id as string),
    state.delete,
  ]);
  const tags = useTagStore((state) => state.tags);
  note = NoteTagMapper(new Map().set(id, note), tags)[0].note;
  const state = useTokenStore((state) => state);
  const navigate = useNavigate();
  const deleteNote = async () => {
    const token = await refreshToken(
      navigate,
      state.hasExpired,
      state.update,
      state.token
    );
    if (token) {
      await apiNoteDelete(delet, id as string, token, navigate);
      navigate("/home");
    }
  };
  return (
    <div className={style.note}>
      <div className={style.firstLayer}>
        <div>
          <span>{note.title}</span>
          <div>
            {note.tags.map((el) => (
              <span>{el}</span>
            ))}
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              navigate(`/note/${id}/edit`);
            }}
          >
            Edit
          </button>
          <button onClick={deleteNote}>Delete</button>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div className={style.secondLayer}>
        <div>{note.content}</div>
        <img
          src={`/api/static/imgs/${note.ImagePath}?${new Date().getTime()}`}
          alt="oops"
          style={{ display: `${note.ImagePath === "" ? "none" : "block"}` }}
        />
      </div>
    </div>
  );
}

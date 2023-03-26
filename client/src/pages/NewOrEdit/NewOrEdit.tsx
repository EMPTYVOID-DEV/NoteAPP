import { useRef, useState } from "react";
import { note } from "../../utils/types";
import makeAnimated from "react-select/animated";
import {
  useNoteStore,
  useTagStore,
  useTokenStore,
} from "../../utils/zustandStore";
import styles from "./New.module.css";
import Creatable from "react-select/creatable";
import {
  apiTagUpdateOrCreate,
  apiNoteUpdateorCreate,
  refreshToken,
} from "../../utils/apiFunctions";
import { v4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";

export default function NewOrEdit({ isEdit }: { isEdit: boolean }) {
  const { id } = useParams();
  const imgRef = useRef<HTMLImageElement>(null);
  const search = useNoteStore((state) => state.search);
  const state = useTokenStore((state) => state);
  const navigate = useNavigate();
  const [img, setImg] = useState<File | null>(null);
  const [noteinfo, changeNote] = useState<note>(() => {
    return isEdit
      ? search(id as string)
      : {
          title: "",
          tags: [],
          content: "",
          ImagePath: "",
        };
  });
  const [tags, push] = useTagStore((state) => [state.tags, state.push]);

  const createTagHandle = async (newOption: string) => {
    let key = v4();
    const token = await refreshToken(
      navigate,
      state.hasExpired,
      state.update,
      state.token
    );
    if (token) {
      await apiTagUpdateOrCreate(newOption, key, state.token, navigate);
      push(newOption, key);
    }
  };

  const createNoteHandle = async () => {
    const token = await refreshToken(
      navigate,
      state.hasExpired,
      state.update,
      state.token
    );
    if (token) {
      const path = img
        ? isEdit
          ? noteinfo.ImagePath.split(".")[0] + "." + img?.name.split(".")[1]
          : v4() + "." + img.name.split(".")[1]
        : noteinfo.ImagePath;
      await apiNoteUpdateorCreate(
        token,
        navigate,
        id ? id : v4(),
        { ...noteinfo, ImagePath: path },
        img
      );
      navigate("/home");
    }
  };
  return (
    <div className={styles.NewOrEdit}>
      <div className={styles.firstLayer}>
        <div className={styles.title}>
          <h3>The Title</h3>
          <input
            type="text"
            defaultValue={noteinfo.title}
            onChange={(e) => changeNote({ ...noteinfo, title: e.target.value })}
          />
        </div>
        <div className={styles.tagSelection}>
          <h3>Note related Tags</h3>
          <Creatable
            defaultValue={(() => {
              return isEdit
                ? noteinfo.tags.map((el) => ({
                    label: tags.get(el),
                    value: el,
                  }))
                : null;
            })()}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: "15px",
                height: "2.5rem",
                color: "violet",
              }),

              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "80%",
              }),
            }}
            options={(() => {
              let options = [];
              for (let [value, label] of tags.entries()) {
                options.push({ label, value });
              }
              return options;
            })()}
            onChange={(selectedTag) => {
              let newtags = [];
              for (let tag of selectedTag) {
                let val = tag as { label: string; value: string };
                newtags.push(val.value);
              }
              changeNote({ ...noteinfo, tags: newtags });
            }}
            onCreateOption={createTagHandle}
            components={makeAnimated()}
            isMulti
          />
        </div>
      </div>
      <textarea
        value={noteinfo.content}
        onChange={(e) => changeNote({ ...noteinfo, content: e.target.value })}
      />
      <div className={styles.secondLayer}>
        <div>
          <img
            ref={imgRef}
            style={{
              display: `${img || noteinfo.ImagePath !== "" ? "block" : "none"}`,
            }}
            src={`/api/static/imgs/${noteinfo.ImagePath}`}
          />
          <span
            style={{
              display: `${img || noteinfo.ImagePath !== "" ? "none" : "block"}`,
            }}
          >
            no image has been uploaded yet
          </span>
        </div>
        <div>
          <input
            id="image"
            accept="image/*"
            onChange={(e) => {
              imgRef.current!.src = URL.createObjectURL(e.target.files![0]);
              setImg(e.target.files![0]);
            }}
            type={"file"}
          />
          <label htmlFor={"image"}>Upload Your Image</label>
        </div>
      </div>
      <div className={styles.lastLayer}>
        <button onClick={() => navigate("/home")}>Cancel</button>
        <button onClick={createNoteHandle}>{isEdit ? "Edit" : "Create"}</button>
      </div>
    </div>
  );
}

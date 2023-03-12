import React, { useState } from "react";
import styles from "./EditTags.module.css";
import { ReplaceTags, refreshToken } from "../../utils/apiFunctions";
import { useTokenStore, useTagStore } from "../../utils/zustandStore";
import { useNavigate } from "react-router";

export default function EditTags({
  SetAppearence,
}: {
  SetAppearence: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}) {
  const [tags, intial] = useTagStore((state) => [state.tags, state.intail]);
  const state = useTokenStore((state) => state);
  const navigate = useNavigate();
  const [newTags, updateTags] = useState([...tags]);
  const Submithandler = async () => {
    const token = await refreshToken(
      navigate,
      state.hasExpired,
      state.update,
      state.token
    );
    if (newTags.length === 0) {
      SetAppearence(false);
    } else if (token) {
      ReplaceTags(new Map(newTags), token, navigate);
    }
  };

  const deleteHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    let index = e.currentTarget.dataset.index as string;
    newTags.splice(+index, 1);
    updateTags([...newTags]);
  };

  const updateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newvalue = e.currentTarget.value;
    let index = e.currentTarget.dataset.index as string;
    newTags[+index] = [newTags[+index][0], newvalue];
    updateTags([...newTags]);
  };

  return (
    <div className={styles.editback}>
      <div className={styles.edit}>
        <div>
          <span>Edit Tags</span>
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              SetAppearence(false);
            }}
          ></i>
        </div>
        <div className={styles.Tags}>
          {newTags.map(([key, value], idx) => (
            <div className={styles.tag} key={key}>
              <input
                type="text"
                defaultValue={value}
                onChange={updateHandler}
                data-index={idx}
              />
              <span>
                <i
                  className="fa-solid fa-trash-can"
                  onClick={deleteHandler}
                ></i>
              </span>
            </div>
          ))}
        </div>
        <button onClick={Submithandler}>Save</button>
      </div>
    </div>
  );
}

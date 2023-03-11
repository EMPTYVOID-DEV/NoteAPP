import { note } from "./types";

export const passwordChecker = (password: string) => {
  const VeryStrongpassRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9])(?=.{8,})/;

  const StrongPassRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})|(?=.*[a-zA-Z0-9])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})|(?=.*[a-z])(?=.*[a-zA-Z0-9])(?=.*[0-9])(?=.{8,})|(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z0-9])(?=.{8,})/;
  const meduimPassRegex =
    /((?=.*[a-z])(?=.*[A-Z])(?=.{6,}))|((?=.*[a-z])(?=.*[0-9])(?=.{6,}))|((?=.*[A-Z])(?=.*[0-9])(?=.{6,}))|((?=.*[^a-zA-Z0-9])(?=.*[0-9])(?=.{6,}))|((?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.{6,}))|((?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.{6,}))/;
  const weakPassRegex =
    /((?=.*[a-z])(?=.{4,}))|((?=.*[A-Z])(?=.{4,}))|((?=.*[0-9])(?=.{4,}))|((?=.*[^a-zA-Z0-9])(?=.{4,}))/;
  if (VeryStrongpassRegex.test(password)) {
    return 4;
  } else if (StrongPassRegex.test(password)) {
    return 3;
  } else if (meduimPassRegex.test(password)) {
    return 2;
  } else if (weakPassRegex.test(password)) {
    return 1;
  } else {
    return 0;
  }
};
export const emailChecker: (val: string) => boolean = (email: string) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const NoteTagMapper = (
  notes: Map<string, note>,
  tags: Map<string, string>
) => {
  let newnotes: { note: note; id: string }[] = [];
  for (let [id, note] of notes.entries()) {
    let val = note.tags.map((el) => {
      return tags.get(el);
    }) as string[];
    newnotes.push({ note: { ...note, tags: val }, id });
  }
  return newnotes;
};

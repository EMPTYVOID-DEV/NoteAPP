import { create } from "zustand";

import { note } from "./types";

interface tokenstore {
  token: string;
  update: (val: string) => void;
  hasExpired: () => boolean;
}

interface noteStore {
  notes: Map<string, note>;
  push: (val: note, id: string) => void;
  delete: (id: string) => void;
  intail: (notes: Map<string, note>) => void;
  search: (id: string) => note;
}
interface tagStore {
  tags: Map<string, string>;
  push: (val: string, key: string) => void;
  delete: (key: string) => void;
  intail: (tags: Map<string, string>) => void;
}

export const useTokenStore = create<tokenstore>((set, get) => ({
  token: "",
  update: (val: string) => {
    set({ token: val });
  },
  hasExpired: () => {
    const expiry = JSON.parse(atob(get().token.split(".")[1])).exp;
    return (
      Math.floor(new Date().getTime() / 1000) >= expiry || get().token === ""
    );
  },
}));

export const useNoteStore = create<noteStore>((set, get) => ({
  notes: new Map<string, note>(),
  push: (val: note, id: string) => {
    set((state) => new Map(state.notes.set(id, val)));
  },
  delete: (id: string) => {
    let newnotes = new Map(get().notes);
    newnotes.delete(id);
    set({ notes: newnotes });
  },
  search: (id: string) => {
    return get().notes.get(id) as note;
  },
  intail: (val: Map<string, note>) => {
    set({ notes: val });
  },
}));
export const useTagStore = create<tagStore>((set, get) => ({
  tags: new Map<string, string>(),
  push: (val: string, key: string) => {
    set((state) => new Map(state.tags.set(key, val)));
  },

  delete: (key: string) => {
    let newtags = new Map(get().tags);
    newtags.delete(key);
    set({ tags: newtags });
  },
  intail: (val: Map<string, string>) => {
    set({ tags: val });
  },
}));

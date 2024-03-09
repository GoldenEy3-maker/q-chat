import { create } from "zustand";

type OnlineUsersStore = {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

export const useOnlineUsersStore = create<OnlineUsersStore>((set) => ({
  members: [],
  add: (id) => set((store) => ({ members: [...store.members, id] })),
  remove: (id) =>
    set((store) => ({
      members: store.members.filter((member) => member !== id),
    })),
  set: (ids) => set({ members: ids }),
}));

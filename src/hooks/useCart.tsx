import { create } from "zustand";
import { useMemo } from "react";
import { type ItemType } from "~/models/items";
import { filterFirst } from "./filterFirst";

type Store = {
  list: ItemType[];
  addToList: (item: ItemType) => void;
  removeFromList: (id: string) => void;
};

export const useStore = create<Store>((set) => ({
  list: [],
  addToList: (item) =>
    set((state) => {
      return { list: [...state.list, item] };
    }),
  removeFromList: (itemId) =>
    set((state) => ({
      list: filterFirst(state.list, ({ id }) => id === itemId),
    })),
  setList: (list: Store["list"]) => set(() => ({ list })),
}));

const useList = () => useStore((state) => state.list);
const useAddToList = () => useStore((state) => state.addToList);
const useRemoveFromList = () => useStore((state) => state.removeFromList);
const useFilteredList = (filterId: string) => {
  const list = useList();
  return useMemo(
    () => (filterId === "" ? list : list.filter((l) => l.id === filterId)),
    [filterId, list]
  );
};

export const useCart = (id = "") => {
  const list = useList();
  const add = useAddToList();
  const del = useRemoveFromList();
  const total = list.reduce((p, item) => item.price + p, 0);
  // const filter = useFilteredList;
  const count = useFilteredList(id).length;
  return useMemo(
    () => ({
      count,
      total,
      list,
      add,
      del,
    }),
    [list, add, del, total, count]
  );
};

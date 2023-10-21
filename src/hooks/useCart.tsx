import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useMemo, useState } from "react";
import { type ItemType } from "~/models/items";
import { filterFirst } from "./filterFirst";

type Store = {
  list: ItemType[];
  addToList: (item: ItemType) => void;
  removeFromList: (id: string) => void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
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
    }),
    {
      name: "cart-storage", // this must be a unique name
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);

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

/*
  id: string;{
    count: number;
    total: number;
    item: ItemType;
  }
*/
type ItemizedList = Map<
  string,
  { total: number; count: number; item: ItemType }
>;

const useItemizedList = () => {
  const list = useList();
  return useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const item of list) {
      map.set(item.id, map.get(item.id) ?? []);
    }
  }, [list]);
};

export const useCart = (id = "") => {
  const list = useList();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void (async function () {
      await useStore.persist.rehydrate();
      setLoading(false);
    })();
  }, []);
  const itemizedList = useItemizedList();
  const add = useAddToList();
  const del = useRemoveFromList();
  const total = list.reduce((p, item) => item.price + p, 0);
  const count = useFilteredList(id).length;
  return useMemo(
    () => ({
      count,
      total,
      itemizedList,
      list,
      add,
      del,
      loading,
    }),
    [list, add, del, total, count, loading]
  );
};

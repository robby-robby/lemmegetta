import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useMemo, useState } from "react";
import { type ItemType } from "~/models/items";
import { filterFirst } from "./filterFirst";

type Store = {
  cart: string[];
  setList: (cart: Store["cart"]) => void;
  emptyList: () => void;
  addToList: (id: string) => void;
  removeFromList: (id: string) => void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
      cart: [],
      setList: (cart: Store["cart"]) => set(() => ({ cart: cart })),
      emptyList: () => set(() => ({ cart: [] })),
      addToList: (id) =>
        set((state) => {
          return { cart: [...state.cart, id] };
        }),
      removeFromList: (itemId) =>
        set((state) => ({
          cart: filterFirst(state.cart, (id) => id === itemId),
        })),
    }),
    {
      name: "cart-storage", // this must be a unique name
      version: 3,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);

const useEmptyCart = () => useStore((state) => state.emptyList);
const useList = () => useStore((state) => state.cart);
const useAddToList = () => useStore((state) => state.addToList);
const useRemoveFromList = () => useStore((state) => state.removeFromList);
const useFilterList = (filterId: string) => {
  const cart = useList();
  return useMemo(
    () => (filterId === "" ? cart : cart.filter((id) => id === filterId)),
    [filterId, cart]
  );
};

export const useCart = (itemsById: Record<ItemType["id"], ItemType> = {}) => {
  const cart = useList();

  const [loading, setLoading] = useState(true);
  //TODO clear cart if ids do not exist
  useEffect(() => {
    void (async function () {
      await useStore.persist.rehydrate();
      setLoading(false);
    })();
  }, []);
  const empty = useEmptyCart();
  const add = useAddToList();
  const del = useRemoveFromList();
  const total = useMemo(() => {
    return cart.reduce((p, id) => (itemsById[id]?.price ?? 0) + p, 0);
  }, [cart, itemsById]);
  const count = cart.length;
  const uniqIds = useMemo(() => [...new Set(cart)], [cart]);
  const countById = useMemo(() => {
    return cart.reduce((p, id) => {
      p[id] = (p[id] ?? 0) + 1;
      return p;
    }, {} as Record<string, number>);
  }, [cart]);
  const itemsWithCountAndTotal = useMemo(() => {
    return uniqIds.map((id) => {
      const item = itemsById[id] ?? { price: 0 };
      const count = countById[id];
      const total = (item.price ?? 0) * (count ?? 0);
      return { ...item, count, total } as ItemType & {
        count: number;
        total: number;
      };
    });
  }, [uniqIds, countById, itemsById]);

  const sortedItemsWithCountAndTotal = useMemo(
    () =>
      itemsWithCountAndTotal.sort((a, b) => {
        return 1;
        // if (a === null || a?.id === null) return 1;
        // return a.id.localeCompare(b.id);
      }),
    [itemsWithCountAndTotal]
  );

  return useMemo(
    () => ({
      count,
      total,
      uniqIds,
      countById,
      empty,
      cart,
      itemsWithCountAndTotal,
      sortedItemsWithCountAndTotal,
      useFilterList,
      add,
      del,
      loading,
    }),
    [cart, add, del, total, count, loading]
  );
};

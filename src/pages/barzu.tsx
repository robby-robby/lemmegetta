import { create } from "zustand";
import { useMemo, useState } from "react";

type Item = { id: string };

type Store = {
  list: Item[];
  addToList: (item: Item) => void;
  removeFromList: (id: string) => void;
};

export const useStore = create<Store>((set) => ({
  list: [],
  addToList: (item) => {
    console.log(item);
    return set((state) => ({ list: [...state.list, item] }));
  },
  removeFromList: (id) =>
    set((state) => ({ list: state.list.filter((item) => item.id !== id) })),
}));

let id = 0;

const makeItem = (id: string): Item => ({ id });

const randomId = () => Math.floor(Math.random() * id);

const useList = () => useStore((state) => state.list);
const useAddToList = () => useStore((state) => state.addToList);
const useRemoveFromList = () => useStore((state) => state.removeFromList);
export const useFilteredList = (filterId: string) => {
  const list = useList();
  return useMemo(() => list.filter((l) => l.id !== filterId), [filterId, list]);
};

export default function Home() {
  const list = useList();
  const addToList = useAddToList();
  const removeFromList = useRemoveFromList();
  const [filterId, setFilterId] = useState("");
  const filteredList = useFilteredList(filterId);

  return (
    <div className="text-2xl">
      <div className="text-sm">
        <pre>{JSON.stringify(list)}</pre>
      </div>
      <br></br>
      <div>
        <button
          onClick={() => addToList(makeItem((id++).toString()))}
          type="button"
          className="m-3 rounded border-2 border-black p-3"
        >
          FOO
        </button>
        <button
          onClick={() => removeFromList(randomId().toString())}
          type="button"
          className="m-3 rounded border-2 border-black p-3"
        >
          BAR
        </button>
        <input
          type="text"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="border-2 border-black"
        ></input>
      </div>
      <div className="text-sm">
        filtered list:
        <pre>{JSON.stringify(filteredList)}</pre>
      </div>
    </div>
  );
}

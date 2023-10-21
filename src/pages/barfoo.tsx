import { atom, useAtom } from "jotai";
import { useMemo, useState } from "react";
type Item = { id: string };
const listAtom = atom([] as Item[]);
const makeItem = (id: string): Item => ({ id });

let id = 0;
const addToListAtom = atom(null, (get, set) => {
  // Current state of the cart
  const currentList = get(listAtom);

  // Add the new item to the cart
  const newCart = [...currentList, makeItem(id++ + "")];

  // Update the cart atom with the new cart
  set(listAtom, newCart);
});

const useFilteredList = (filterId: string, list: Item[]) =>
  useMemo(() => list.filter((l) => l.id !== filterId), [filterId, list]);

const removeFromListAtom = atom(null, (get, set, id: string) => {
  // Current state of the cart
  const currentList = get(listAtom);

  // Add the new item to the cart
  const newCart = currentList.filter((item) => item.id !== id);

  // Update the cart atom with the new cart
  set(listAtom, newCart);
});

const useRemoveFromList = () => useAtom(removeFromListAtom)[1];
const useAddToList = () => useAtom(addToListAtom)[1];
const useList = () => useAtom(listAtom)[0];

const randomId = () => Math.floor(Math.random() * id);
export default function Home() {
  const list = useList();
  const [filterId, setFilterId] = useState("");
  const addToList = useAddToList();
  const removeFromList = useRemoveFromList();
  const filteredList = useFilteredList(filterId, list);

  // const addToList = ()=> setList({id: id++ }
  return (
    <div className="text-2xl">
      <div className="text-sm">
        <pre>{JSON.stringify(list)}</pre>
      </div>
      <br></br>
      <div>
        <button
          onClick={addToList}
          type="button"
          className="m-3 rounded border-2 border-black p-3"
        >
          FOO
        </button>

        <button
          onClick={() => removeFromList(randomId() + "")}
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

import { useEffect, useState } from "react";
import { NullItem, type ItemType } from "~/models/items";

/**
 * Helper hook to edit items in a list by selecting an item by id
 * @param items[] - An array of items to edit
 * @returns {object} - An object containing the editItem, editItemById, and setEditItem functions
 */
export function useItemEditor(items: ItemType[]) {
  const [editItemId, setEditItemId] = useState("");
  const [editItem, setEditItem] = useState(NullItem);
  useEffect(() => {
    if (editItemId) {
      const i = items.find((item) => item.id === editItemId);
      setEditItem(i ?? NullItem);
    }
  }, [editItemId, items]);

  const editItemById = (id: string) => {
    setEditItemId(id);
  };
  return { editItem, editItemById: editItemById, setEditItem };
}

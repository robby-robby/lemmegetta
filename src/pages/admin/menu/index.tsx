/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { type ReactElement, useState } from "react";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import ItemModal, {
  // ItemModalState,
  useItemModal,
} from "~/components/ItemModal";
import AdminLayout from "~/components/AdminLayout";

import { NullItem, type ItemType } from "~/models/items";
import {
  SaveModal,
  SaveStatus,
  type SaveStatusType,
  useSaveModal,
} from "~/components/SaveModal";
import { useEscapeModal } from "~/hooks/useEscapeModal";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import { useItemEditor } from "~/models/items/useItemEditor";

function MenuPage() {
  const {
    open: saveModalOpen,
    close: saveModalClose,
    state: saveModalState,
    status: saveModalStatus,
    onStatusChange,
  } = useSaveModal();
  const {
    open: itemModalOpen,
    close: itemModalClose,
    state: itemModalState,
  } = useItemModal();

  const [addItem, setAddItem] = useState({ ...NullItem });

  const onSuccess = (i: ItemType) => {
    saveModalOpen();
    itemModalClose();
    setAddItem({ ...NullItem });
  };
  const onFailure = (e: Error) => {
    console.error(e);
    throw e;
  };
  const { items, create, update, refetch } = useItemsRPC(
    onSuccess,
    onFailure,
    onStatusChange
  );
  const { editItem, editItemById } = useItemEditor(items);

  const { open: editOpen, close: editClose, state: editState } = useItemModal();

  useEscapeModal(editClose);

  const openEditItem = (itemId: string) => {
    editItemById(itemId);
    editOpen();
  };
  const editSave = async (item: ItemType) => {
    editClose();
    await update(item);
    return refetch();
  };

  return (
    <>
      {/* <ShoppingCartButton /> */}
      <SaveModal
        state={saveModalState}
        close={saveModalClose}
        status={saveModalStatus}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center">
          <div className="h-full md:w-full">
            <h1 className="mb-4 text-center text-3xl font-bold">Menu</h1>
            <div className="mb-3 flex justify-end">
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={itemModalOpen}
              >
                Add +
              </button>
            </div>
            <div className="-mx-4 flex flex-wrap">
              <ItemsGrid items={items} openEditItem={openEditItem} />
            </div>
          </div>
        </div>
        <ItemModal
          title="Edit Item"
          show={editState}
          onClose={editClose}
          onSubmit={editSave}
          defaultItem={editItem}
        />
        <ItemModal
          title="Add Item"
          show={itemModalState}
          onClose={itemModalClose}
          onSubmit={create}
          defaultItem={addItem}
        />
      </div>
    </>
  );
}

function ItemsGrid({
  items,
  openEditItem,
}: {
  items: ItemType[];
  openEditItem: (id: string) => void;
}): ReactElement {
  if (!items || items?.length === 0) {
    return (
      <p className="h-full w-full text-center text-4xl font-thin">
        Nothing to see here 🔎
        <br></br>
        Click &apos;Add +&apos; to add items to the menu
      </p>
    );
  }
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} edit={openEditItem} />
      ))}
    </>
  );
}

function Item({
  item,
  edit,
}: {
  item: ItemType;
  edit: (id: string) => void;
}): ReactElement {
  return (
    <div className="mb-4 w-full px-4 md:w-1/2 lg:w-1/4" key={item.id}>
      <div className="rounded bg-white shadow-lg">
        <img
          className="w-full rounded-t"
          src={item.imageUrl || "https://placehold.co/400"}
          alt={item.name}
        />
        <div className="p-4">
          <h2 className="text-lg font-bold">{item.name}</h2>
          <p className="mb-2 text-gray-600">{item.description}</p>
          <ul>
            <li>Short Code: {item.shortCode}</li>
            <li>Price: ${item.price.toFixed(2)}</li>
          </ul>
        </div>
        <div className="flex justify-center p-4">
          <button
            onClick={() => edit(item.id)}
            className="mx-1 rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <FiEdit2 />
          </button>
          <button className="mx-1 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
            <FiTrash2 />
          </button>
          <button className="mx-1 rounded-lg bg-blue-300 px-4 py-2 font-bold text-white hover:bg-blue-400">
            <FiEye />
          </button>
        </div>
      </div>
    </div>
  );
}

MenuPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default MenuPage;

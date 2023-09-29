/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { type ReactElement, useState } from "react";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import { ItemModal, useItemModal } from "~/components/ItemModal";
import AdminLayout from "~/components/AdminLayout";

import { NullItem, type ItemType } from "~/models/items";
import { SaveModal, useSaveModal } from "~/components/SaveModal";
import { useEscapeModal } from "~/hooks/useEscapeModal";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import { useItemEditor } from "~/models/items/useItemEditor";
import { isZodError, ZodErrorObject } from "~/utils/misc";

function MenuPage() {
  const {
    open: saveModalOpen,
    close: saveModalClose,
    state: saveModalState,
    status: saveModalStatus,
    onStatusChange,
  } = useSaveModal();

  const { open: addOpen, close: addClose, state: addState } = useItemModal();
  const { open: editOpen, close: editClose, state: editState } = useItemModal();

  const [addItem, setAddItem] = useState({ ...NullItem });
  const addItemReset = () => setAddItem({ ...NullItem });

  const onFailure = (e: Error) => {
    console.error(e);
    throw e;
  };
  const { items, remove, createAsync, updateAsync } =
    useItemsRPC(onStatusChange);

  const { editItem, editItemById } = useItemEditor(items);

  const { zodErrors, zodErrorsSet, zodErrorsReset } = useZodErrors();

  const onSubmitCreate = async (item: ItemType) => {
    try {
      await createAsync(item);
      saveModalOpen();
      addClose();
      setAddItem({ ...NullItem });
    } catch (error) {
      if (isZodError(error)) {
        return zodErrorsSet(error.data.zodError);
      }
      //ELSE TODO WTF OMG!
      // throw error
      addClose();
      saveModalOpen();
    }
  };

  const onSubmitEdit = async (item: ItemType) => {
    try {
      await updateAsync(item);
      editClose();
    } catch (e) {
      onFailure(e as Error);
    }
  };
  useEscapeModal(editClose);

  const openAddItem = () => {
    zodErrorsReset();
    addItemReset();
    addOpen();
  };

  const openEditItem = (itemId: string) => {
    zodErrorsReset();
    editItemById(itemId);
    editOpen();
  };

  // const removeAndUpdate = async (id: ItemType["id"]) => {
  //   remove(id);
  //   // const r = await refetch();
  //   // console.log(items.length, r);
  // };

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
                onClick={openAddItem}
              >
                Add +
              </button>
            </div>
            <div className="-mx-4 flex flex-wrap">
              <ItemsGrid items={items} edit={openEditItem} remove={remove} />
            </div>
          </div>
        </div>
        <ItemModal
          title="Edit Item"
          show={editState}
          onClose={editClose}
          onSubmit={onSubmitEdit}
          defaultItem={editItem}
          zodErrors={zodErrors}
        />
        <ItemModal
          title="Add Item"
          show={addState}
          onClose={addClose}
          onSubmit={onSubmitCreate}
          defaultItem={addItem}
          zodErrors={zodErrors}
        />
      </div>
    </>
  );
}

function useZodErrors() {
  const [zodErrors, zodErrorsSet] = useState<ZodErrorObject>({
    formErrors: [],
    fieldErrors: {},
  });
  const zodErrorsReset = () =>
    zodErrorsSet({ formErrors: [], fieldErrors: {} });

  return {
    zodErrors,
    zodErrorsSet,
    zodErrorsReset,
  };
}
function ItemsGrid({
  items,
  edit,
  remove,
}: {
  items: ItemType[];
  edit: (id: string) => void;
  remove: (id: string) => void;
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
        <Item key={item.id} item={item} remove={remove} edit={edit} />
      ))}
    </>
  );
}

function Item({
  item,
  edit,
  remove,
}: {
  item: ItemType;
  edit: (id: string) => void;
  remove: (id: string) => void;
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
          <button
            onClick={() => remove(item.id)}
            className="mx-1 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
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

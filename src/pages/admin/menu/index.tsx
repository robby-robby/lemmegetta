/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { type ReactElement, useState, useCallback } from "react";
import { ItemModal, useItemModal } from "~/components/ItemModal";
import AdminLayout from "~/components/AdminLayout";
import { type ItemSchemaType, NullItem, type ItemType } from "~/models/items";
import { SaveModal, useSaveModal } from "~/components/SaveModal";
import { useEscapeModal } from "~/hooks/useEscapeModal";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import { useItemEditor } from "~/models/items/useItemEditor";
import { isValidationError } from "~/utils/misc";
import { ConfirmModal, useConfirmModal } from "~/components/ConfirmModal";
import { useVxErrors } from "~/hooks/useVxErrors";
// import { isUniqueConstraintError } from "~/utils/uniqueConstraintErrors";

export const DumbLoadingText = "..l.o.a.d.i.n.g..";
function MenuPage() {
  const {
    success: saveModalSuccess,
    loading: saveModalLoading,
    close: saveModalClose,
    state: saveModalState,
    status: saveModalStatus,
    message: saveModalMessage,
    toughError: saveModalToughError,
  } = useSaveModal();

  const { open: addOpen, close: addClose, state: addState } = useItemModal();
  const { open: editOpen, close: editClose, state: editState } = useItemModal();

  const [addItem, setAddItem] = useState({ ...NullItem });
  // const [removeItemId, setRemoveItemId] = useState<ItemType["id"]>("");
  const [removeItemName, setRemoveItemName] = useState<ItemType["name"]>("");
  const addItemReset = () => setAddItem({ ...NullItem });

  const { items, removeAsync, createAsync, updateAsync, itemsById } =
    useItemsRPC();

  const { editItem, editItemById } = useItemEditor(items);

  const {
    open: confirmModalOpen,
    escape: confirmModalClose,
    state: confirmModalState,
    handle: confirmModalHandle,
  } = useConfirmModal(
    (id?: ItemType["id"]) => onSubmitRemove(id!),
    (itemId?: string) => setRemoveItemName(itemsById[itemId!]?.name ?? "")
  );

  const { vxErrors, vxErrorsReset, vxErrorsSet } =
    useVxErrors<ItemSchemaType>();

  useEscapeModal(confirmModalClose, addClose, editClose);
  const onSubmitCreate = async (item: ItemType) => {
    try {
      saveModalLoading(DumbLoadingText);
      await createAsync(item);
      saveModalSuccess("Item created");
      addClose();
      setAddItem({ ...NullItem });
    } catch (error) {
      if (isValidationError(error)) {
        saveModalClose();
        vxErrorsSet(error.data.validationError);
      } else {
        saveModalToughError(error, "Item creation failed");
      }
    }
  };

  const onSubmitRemove = async (itemId: ItemType["id"]) => {
    try {
      saveModalLoading(DumbLoadingText);
      await removeAsync(itemId);
      saveModalSuccess("Item removed");
    } catch (error) {
      saveModalToughError(error, "Error removing item");
    }
  };

  const onSubmitEdit = async (item: ItemType) => {
    try {
      saveModalLoading(DumbLoadingText);
      await updateAsync(item);
      saveModalSuccess("Item updated");
      editClose();
    } catch (error) {
      if (isValidationError(error)) {
        saveModalClose();
        return vxErrorsSet(error.data.validationError);
      } else {
        saveModalToughError(error, "Item update failed");
      }
    }
  };

  const openAddItem = () => {
    vxErrorsReset();
    addItemReset();
    addOpen();
  };

  const openEditItem = (itemId: string) => {
    vxErrorsReset();
    editItemById(itemId);
    editOpen();
  };

  return (
    <>
      <ConfirmModal
        ok={confirmModalHandle}
        message={`Delete item ${removeItemName}?`}
        close={confirmModalClose}
        state={confirmModalState}
      />
      <SaveModal
        state={saveModalState}
        close={saveModalClose}
        status={saveModalStatus}
        message={saveModalMessage}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center">
          <div className="h-full md:w-full">
            <h1 className="text-thin mb-4 text-center text-3xl uppercase text-slate-800">
              Menu
            </h1>
            <div className="mb-3 flex justify-end">
              <button
                className="group relative rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                onClick={openAddItem}
              >
                Add{" "}
                <span className="inline-block group-hover:animate-bounce">
                  🏀
                </span>
              </button>
            </div>
            <div className="flex flex-wrap">
              <ItemsGrid
                items={items}
                edit={openEditItem}
                remove={confirmModalOpen}
              />
            </div>
          </div>
        </div>
        <ItemModal
          title="Edit Item"
          show={editState}
          onClose={editClose}
          onSubmit={onSubmitEdit}
          defaultItem={editItem}
          vxErrors={vxErrors}
        />
        <ItemModal
          title="Add Item"
          show={addState}
          onClose={addClose}
          onSubmit={onSubmitCreate}
          defaultItem={addItem}
          vxErrors={vxErrors}
        />
      </div>
    </>
  );
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
    <div className="mb-4 w-full px-4 md:w-1/2 lg:w-1/3" key={item.id}>
      <div className="rounded bg-white shadow-lg">
        <img
          className="h-64 w-full bg-gray-200 object-cover object-center"
          src={item.imageUrl || "https://placehold.co/400"}
          alt={item.name}
        />
        <div className="p-4">
          <h2 className="text-lg font-bold">{item.name}</h2>
          <p className="mb-2 text-slate-600">{item.description}</p>
          <ul>
            <li>Short Code: {item.shortCode}</li>
            <li>Price: ${item.price.toFixed(2)}</li>
          </ul>
        </div>
        <div className="flex justify-center p-4">
          <button
            onClick={() => edit(item.id)}
            className="mx-1 rounded-lg bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
          >
            <div>✏️</div>
            {/* <FiEdit2 /> */}
          </button>
          <button
            onClick={() => remove(item.id)}
            className="mx-1 rounded-lg bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
          >
            {/* <FiTrash2 /> */}
            <div>🗑️</div>
          </button>
          <button className="mx-1 rounded-lg bg-indigo-300 px-4 py-2 font-bold text-white hover:bg-indigo-400">
            {/* <FiEye /> */}
            <div>👁️</div>
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

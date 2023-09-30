/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { type ReactElement, useState, useCallback } from "react";
import { ItemModal, useItemModal } from "~/components/ItemModal";
import AdminLayout from "~/components/AdminLayout";

import { ItemMutateProps, NullItem, type ItemType } from "~/models/items";
import { SaveModal, useSaveModal } from "~/components/SaveModal";
import { useEscapeModal } from "~/hooks/useEscapeModal";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import { useItemEditor } from "~/models/items/useItemEditor";
import { isValidationError } from "~/utils/misc";
import { ConfirmModal, useConfirmModal } from "~/components/ConfirmModal";
import { useVxErrors } from "~/hooks/useVxErrors";
// import { isUniqueConstraintError } from "~/utils/uniqueConstraintErrors";

function MenuPage() {
  const {
    // open: saveModalOpen,
    error: saveModalError,
    success: saveModalSuccess,
    loading: saveModalLoading,
    close: saveModalClose,
    state: saveModalState,
    status: saveModalStatus,
    setMessage: saveModalSetMessage,
    message: saveModalMessage,
    // setStatus: saveModalSetStatus,
  } = useSaveModal();

  const {
    open: confirmModalOpen,
    close: confirmModalClose,
    state: confirmModalState,
    confirmFor: confirmModalFor,
    message: confirmModalMessage,
    setMessage: confirmModalSetMessage,
  } = useConfirmModal<string>();

  useEscapeModal(confirmModalClose);

  const { open: addOpen, close: addClose, state: addState } = useItemModal();
  const { open: editOpen, close: editClose, state: editState } = useItemModal();

  useEscapeModal(addClose);
  useEscapeModal(editClose);

  const [addItem, setAddItem] = useState({ ...NullItem });
  const addItemReset = () => setAddItem({ ...NullItem });

  // const openSaveModal = (status: SaveStatusType, action: ItemsRPCAction) => {
  //   saveModalSetStatus(status);
  //   const outcome = status === "success" ? "successful" : "failed";
  //   saveModalOpen(action + " " + outcome);
  // };

  const { items, removeAsync, createAsync, updateAsync } = useItemsRPC();
  // (status) =>
  //   status === "loading"
  //     ? saveModalOpen({ status, message: "..." })
  //     : undefined

  const { editItem, editItemById } = useItemEditor(items);

  const confirmAndDeleteItem = useCallback(
    (itemId: string) => {
      const i = items.find((item) => item.id === itemId);
      const n = i?.name ?? "<Unknown>";
      confirmModalSetMessage(`Delete item ${n}?`);
      confirmModalOpen(itemId);
    },
    [items]
  );

  // vxErrors?: FormFieldErrorsObject<ItemMutateProps>;

  // vxErrors?: FormFieldErrorsObject<PaymentMutateProps>;
  const {
    vxErrors: vxErrors,
    vxErrorsSet: vxErrorsSet,
    vxErrorsReset: vxErrorsReset,
  } = useVxErrors<ItemMutateProps>();

  const onSubmitCreate = async (item: ItemType) => {
    try {
      saveModalLoading("...");
      await createAsync(item);
      saveModalSuccess("Item created");
      addClose();
      setAddItem({ ...NullItem });
    } catch (error) {
      if (isValidationError(error)) {
        saveModalClose();
        return vxErrorsSet(error.data.validationError);
      }
      saveModalError("Item creation failed");
      if (error instanceof Error) {
        saveModalSetMessage(error.message ?? "Unknown error");
      } else {
        saveModalSetMessage("Unknown error");
        console.error(error);
      }
    } finally {
      // saveModalClose();
    }
  };

  const onSubmitRemove = async (itemId: ItemType["id"]) => {
    try {
      saveModalLoading("...");
      await removeAsync(itemId);
      saveModalSuccess("Item removed");
    } catch (error) {
      // if (isZodError(error)) {
      //   return vxErrorsSet(error.data.zodError);
      // }
      let message = "Unknown error";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      saveModalError(message);
      console.error(error);
    } finally {
      // saveModalClose();
    }
  };

  const onSubmitEdit = async (item: ItemType) => {
    try {
      saveModalLoading("...");
      await updateAsync(item);
      saveModalSuccess("Item updated");
      editClose();
    } catch (error) {
      if (isValidationError(error)) {
        saveModalClose();
        return vxErrorsSet(error.data.validationError);
      } else {
        saveModalError("Item update failed");
      }
    } finally {
      // saveModalClose();
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
      {/* <ShoppingCartButton /> */}
      <ConfirmModal
        ok={() => onSubmitRemove(confirmModalFor)}
        close={confirmModalClose}
        message={confirmModalMessage}
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
                className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                onClick={openAddItem}
              >
                Add 🏀
              </button>
            </div>
            <div className="-mx-4 flex flex-wrap">
              <ItemsGrid
                items={items}
                edit={openEditItem}
                remove={confirmAndDeleteItem}
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
      <Item
        key={NullItem.id}
        item={{ ...NullItem, imageUrl: "!" }}
        remove={remove}
        edit={edit}
      />
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

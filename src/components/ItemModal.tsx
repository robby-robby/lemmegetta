import React, { useCallback, useEffect, useState } from "react";
// import { useEscapeModal } from "~/hooks/useEscapeModal";
import { NullItem, type ItemType } from "~/models/items";
import { ZodErrorObject } from "~/utils/misc";

interface Props {
  title?: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: ItemType) => void;
  defaultItem?: ItemType;
  zodErrors?: ZodErrorObject;
}

export const ItemModalState = {
  open: true,
  close: false,
};
export type ItemModalStates =
  (typeof ItemModalState)[keyof typeof ItemModalState];

export function useItemModal() {
  const [showModal, setShowModal] = useState<ItemModalStates>(false);
  const open = () => setShowModal(true);
  const close = () => setShowModal(false);
  return { open, close, state: showModal };
}

// function useHasErrors(errors: object) {
//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       console.log("errors:", errors);
//     }
//   }, [errors]);
// }

export const ItemModalForm = ({
  fileChange,
  inputChange,
  item,
  close,
  submit,
  zodErrors,
}: // formErrors,
// fieldErrors,
{
  fileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  close: () => void;
  submit: (i: ItemType) => void;
  item: ItemType;
  // formErrors?: string[];
  // fieldErrors?: Record<string, string[]>;
  zodErrors?: ZodErrorObject;
}) => {
  const { fieldErrors, formErrors } = zodErrors ?? {};
  return (
    <div className="mt-5">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Name</label>
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={inputChange}
          required
          className={`mt-1 w-full rounded-md border p-2 ${
            fieldErrors?.name ? "border-red-500" : ""
          }`}
        />
        {fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={item.description}
          onChange={inputChange}
          required
          className={`mt-1 w-full rounded-md border p-2 ${
            fieldErrors?.description ? "border-red-500" : ""
          }`}
        />
        {fieldErrors?.description && (
          <p className="mt-1 text-xs text-red-500">
            {fieldErrors?.description[0]}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Short Code
        </label>
        <input
          type="text"
          name="shortCode"
          value={item.shortCode}
          onChange={inputChange}
          required
          className={`mt-1 w-full rounded-md border p-2 ${
            fieldErrors?.shortCode ? "border-red-500" : ""
          }`}
        />
        {fieldErrors?.shortCode && (
          <p className="mt-1 text-xs text-red-500">
            {fieldErrors?.shortCode[0]}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={item.price}
          onChange={inputChange}
          required
          className={`mt-1 w-full rounded-md border p-2 ${
            fieldErrors?.shortCode ? "border-red-500" : ""
          }`}
        />
        {fieldErrors?.price && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors?.price[0]}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Image</label>
        <input
          type="file"
          name="image"
          value={item.imageUrl}
          onChange={fileChange}
          className="mt-1 w-full rounded-md border p-2"
        />
      </div>
      {formErrors && formErrors.length > 0 && (
        <div className="mb-4">
          {formErrors?.map((error, index) => (
            <p key={index} className="mt-1 text-xs text-red-500">
              {error}
            </p>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={close}
          className="mr-2 rounded bg-gray-400 px-4 py-2 font-bold text-white hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => submit(item)}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export const ItemModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  defaultItem = NullItem,
  title = "Item",
  zodErrors,
}) => {
  const [itemFormData, setItemFormData] = React.useState<ItemType>(defaultItem);

  useEffect(() => {
    setItemFormData(defaultItem);
  }, [defaultItem]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      const imageUrl = URL.createObjectURL(file);
      setItemFormData((prevData) => ({ ...prevData, imageUrl }));
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${show ? "" : "hidden"}`}
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <ItemModalForm
                  close={onClose}
                  submit={onSubmit}
                  fileChange={fileChange}
                  item={itemFormData}
                  inputChange={inputChange}
                  zodErrors={zodErrors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

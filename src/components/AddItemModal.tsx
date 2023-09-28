import React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}
type FormData = {
  name?: string;
  description?: string;
  image?: File;
  price?: number;
} | null;

const AddItemModal: React.FC<Props> = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState<FormData>(null);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, imageUrl }));
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
                  Add Item
                </h3>
                <div onSubmit={handleSubmit} className="mt-5">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Short Code
                    </label>
                    <input
                      type="text"
                      name="shortCode"
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mr-2 rounded bg-gray-400 px-4 py-2 font-bold text-white hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;

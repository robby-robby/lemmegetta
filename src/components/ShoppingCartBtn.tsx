import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const ShoppingCartButton = () => {
  return (
    <button className="relative rounded-full bg-green-500 p-3 text-white shadow-lg focus:outline-none">
      <FaShoppingCart size={24} />
      <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm text-white">
        3
      </span>
    </button>
  );
};

export default ShoppingCartButton;

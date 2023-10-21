/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { useState, type ReactElement, useMemo } from "react";
import CustomerLayout from "~/components/CustomerLayout";
import { NullItem, type ItemType } from "~/models/items";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import ShoppingCartButton from "~/components/ShoppingCartBtn";
import { useCart } from "~/hooks/useCart";
import { Show } from "./Show";

function MenuPage() {
  const { items } = useItemsRPC();

  return (
    <>
      <div className="sticky top-0 float-right mr-4 h-0">
        {/* <ShoppingCartButton /> */}
      </div>
      <div className="container mx-auto md:px-5">
        <div className="flex flex-wrap justify-center">
          <div className="h-full w-full">
            <h1 className="text-thin mb-4 text-center text-3xl uppercase text-slate-800"></h1>
            {/* <div className="mb-3 flex justify-end"></div> */}
            <div className="-mx-4 flex flex-wrap">
              <ItemsGrid items={items} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ItemsGrid({ items }: { items: ItemType[] }): ReactElement {
  if (!items || items?.length === 0) {
    return (
      <p className="h-full w-full text-center text-4xl font-thin">
        Nothing to see here 🔎
      </p>
    );
  }
  return (
    <>
      {/* <Item key={NullItem.id} item={{ ...NullItem, imageUrl: "!" }} /> */}
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}

function Item({ item }: { item: ItemType }): ReactElement {
  const { add, del, count } = useCart(item.id);

  return (
    <div className="mb-4 w-full px-4 md:w-1/2 lg:w-1/3" key={item.id}>
      <div className="rounded bg-white shadow-lg">
        <img
          className="h-64 w-full bg-gray-200 object-cover object-center"
          src={item.imageUrl || "https://placehold.co/400"}
          alt={item.name}
        />
        <div className="-mt-16 flex justify-end p-2">
          <Show when={count > 0}>
            <button
              onClick={() => del(item.id)}
              className="mx-1 rounded-lg bg-red-400 px-4 py-2 font-bold text-white hover:bg-red-500"
            >
              <MinusSign />
            </button>
          </Show>
          <button
            onClick={() => add(item)}
            className="mx-1 rounded-lg bg-green-400 px-4 py-2 font-bold text-white hover:bg-green-500"
          >
            <PlusSign count={count} />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold">{item.name}</h2>
          <p className="mb-2 text-slate-600">{item.description}</p>
          <ul className="flex items-baseline justify-between">
            <li>Price: ${item.price.toFixed(2)}</li>
            <Show when={count > 0}>
              <li className="text-xs font-bold">
                x {count} = ${(item.price * count).toFixed(2)}
              </li>
            </Show>
          </ul>
        </div>
      </div>
    </div>
  );
}
const PlusSign = ({ count }: { count: number }) => {
  if (count > 0) {
    return <div className="w-6"> {count} </div>;
  }
  return (
    <svg
      className="h-6 w-6 fill-current"
      stroke="white"
      strokeWidth={4}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5V19M5 12H19" />
    </svg>
  );
};

const MinusSign = () => (
  <svg
    className="h-6 w-6 fill-current"
    stroke="white"
    strokeWidth={4}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12H19" />
  </svg>
);

MenuPage.getLayout = function getLayout(page: ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>;
};
export default MenuPage;

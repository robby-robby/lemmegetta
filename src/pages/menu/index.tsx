/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import React, { useState, type ReactElement, useMemo } from "react";
import CustomerLayout from "~/components/CustomerLayout";
import { NullItem, type ItemType } from "~/models/items";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import ShoppingCartButton from "~/components/ShoppingCartBtn";
import { useCart } from "~/hooks/useCart";
import { Show } from "./Show";
import { PlusSign } from "~/components/PlusSign";
import { MinusSign } from "~/components/MinusSign";
import { ifClass } from "~/components/ifClass";

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
            <div className="flex flex-wrap">
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
  const { add, del, countById } = useCart();
  const count = countById[item.id] ?? 0; //filterList(item.id).length;

  return (
    <div className="mb-4 w-full px-4 md:w-1/2 lg:w-1/3" key={item.id}>
      <div
        className={`rounded ${ifClass(
          count > 0,
          "border-green-300"
        )}  border-4 bg-white shadow-lg `}
      >
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
            onClick={() => add(item.id)}
            className={`mx-1 h-10 rounded-lg border-2 border-green-400 px-4 py-2 font-bold
                      ${
                        count === 0
                          ? "bg-green-400 text-white hover:bg-green-500"
                          : "bg-white text-green-400 hover:text-green-500"
                      }
                    `}
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
MenuPage.getLayout = function getLayout(page: ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>;
};
export default MenuPage;

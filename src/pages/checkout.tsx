/* eslint-disable @next/next/no-img-element */
import { ReactElement, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CustomerLayout from "~/components/CustomerLayout";
import { useCart } from "~/hooks/useCart";
import { useItemsRPC } from "~/models/items/useItemsRPC";
import { Show } from "../components/Show";
import { MinusSign } from "~/components/MinusSign";
import { PlusSign } from "~/components/PlusSign";
import { ifClass } from "~/components/ifClass";
import Link from "next/link";
import { LINKS } from "~/components/links";
import { OkCancelModal } from "~/components/OkCancelModal";
import { ConfirmState, useConfirmModal } from "~/components/ConfirmModal";
import { ItemType } from "~/models/items";
import { useEscapeModal } from "~/hooks/useEscapeModal";

function useRemoveLastItem<T>(delFn: (id: T) => void) {
  const [state, setState] = useState(ConfirmState.close);
  const [id, setId] = useState<T>();
  const confirm = (itemId: T) => {
    setId(itemId);
    setState(ConfirmState.open);
  };
  const handle = () => {
    if (id != null) delFn(id);
    setState(ConfirmState.close);
  };
  return {
    setState,
    state,
    confirm,
    handle,
    id,
  };
}

function Checkout() {
  const { itemsById } = useItemsRPC();
  const {
    sortedItemsWithCountAndTotal: items,
    total,
    del,
    add,
    count,
    empty,
  } = useCart(itemsById);

  const [removeItemId, setRemoveItemId] = useState<ItemType["id"]>("");
  const {
    state: removeModalState,
    setState: setRemoveModalState,
    handle: handleRemoveItem,
    open: setRemoveIdAndOpenModal,
    escape: closeRemoveModal,
  } = useConfirmModal(
    () => del(removeItemId),
    (id?: ItemType["id"]) => setRemoveItemId(id!)
  );

  const {
    state: emptyModalState,
    setState: setEmptyModalState,
    handle: handleEmptyCart,
    escape: closeEmptyModal,
  } = useConfirmModal(empty);

  useEscapeModal(closeEmptyModal, closeRemoveModal);

  return (
    <>
      <OkCancelModal
        state={removeModalState}
        message={"Remove item from cart?"}
        ok={() => handleRemoveItem()}
        cancel={() => setRemoveModalState(ConfirmState.close)}
      />
      <OkCancelModal
        state={emptyModalState}
        message={"Empty cart?"}
        ok={() => handleEmptyCart()}
        cancel={() => setEmptyModalState(ConfirmState.close)}
      />
      <div className="flex items-start justify-center bg-gray-100">
        <div className="m-4 w-full max-w-lg rounded-lg bg-white shadow-md sm:p-3 ">
          <div className="p-4">
            <Show when={items.length === 0}>
              <span className="mb-5 inline-block text-2xl">
                Shopping cart empty {"🕳"} {"🐇"}
              </span>
              ️
            </Show>
            {items.map((item) => (
              <div
                key={item.id}
                className="mb-4 grid grid-cols-7 gap-4 rounded bg-gray-200 p-4"
              >
                <img
                  className="col-span-3 h-32 w-full object-cover"
                  src={"https://placehold.co/400"}
                  alt={item.name}
                />
                <div className="col-span-2">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <p className="text-lg text-gray-900">
                    {item.price.toFixed(2)}$
                  </p>
                  <p className="text-xs text-gray-500">{item.shortCode}</p>
                </div>

                <div className="col-span-2 -mb-4 -mr-4 flex items-end justify-end p-2">
                  <Show when={item.count === 1}>
                    <button
                      onClick={() => setRemoveIdAndOpenModal(item.id)}
                      className="mx-1 h-10 rounded-lg bg-red-400 px-4 py-2 font-bold text-white hover:bg-red-500"
                    >
                      <span className="text-xs">Remove</span>
                    </button>
                  </Show>
                  <Show when={item.count > 1}>
                    <button
                      onClick={() => del(item.id)}
                      className="mx-1 h-10 rounded-lg bg-red-400 px-4 py-2 font-bold text-white hover:bg-red-500"
                    >
                      <MinusSign />
                    </button>
                  </Show>
                  <button
                    onClick={() => add(item.id)}
                    className={`mx-1 h-10 rounded-lg border-2 border-green-400 px-4 py-2 font-bold
                      ${
                        item.count === 0
                          ? "bg-green-400 text-white hover:bg-green-500"
                          : " bg-white text-green-400 hover:text-green-500"
                      }
                    `}
                  >
                    <PlusSign count={item.count} />
                  </button>
                </div>
              </div>
            ))}
            <h2 className="text-right text-2xl font-bold">
              Total: {"$"}
              {total.toFixed(2)}
              {"💸"}
            </h2>
          </div>
          <div className="flex justify-between space-x-4 p-4">
            <button
              onClick={() => setEmptyModalState(ConfirmState.open)}
              className={`rounded border-2 border-black p-2 text-black hover:bg-black hover:text-white ${ifClass(
                count === 0,
                "invisible"
              )}`}
            >
              Empty Cart
            </button>
            <div className="space-x-4">
              <Link
                href={LINKS.menu}
                className="inline-block rounded bg-blue-400 p-3 text-white hover:bg-blue-500"
              >
                Back
              </Link>
              <button
                disabled={count === 0}
                className="rounded bg-green-400 p-3 text-white hover:bg-green-500 disabled:bg-gray-400"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Checkout.getLayout = function getLayout(page: ReactElement) {
  return <CustomerLayout page={"checkout"}>{page}</CustomerLayout>;
};
export default Checkout;

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ShoppingCartButton from "./ShoppingCartBtn";
import LemonWheelSvg from "~/components/LemonWheel.svg";
import { BrandHead } from "~/components/BrandHead";
import { useCart } from "~/hooks/useCart";
import { Show } from "~/pages/menu/Show";

const LINKS = {
  menu: "/menu",
};

const Lemon = () => (
  <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50%" cy="50%" rx="45%" ry="65%" fill="yellow" />
    <path d="M65,50 Q70,30 90,40" stroke="green" fill="transparent" />
    <path d="M65,50 Q70,70 90,60" stroke="green" fill="transparent" />
  </svg>
);

function plural(word: string, count: number) {
  return count > 1 ? word + "s" : word;
}

function CheckoutButton({ className }: { className?: string }) {
  const { list, total } = useCart();
  const c =
    className ??
    `text-md rounded-md border-2 border-white px-3 py-2 font-medium text-white`;
  return (
    <>
      <Show when={list.length === 0}>
        <div className="sm:hidden">
          <div className={c}>
            <BrandHead />
          </div>
        </div>
      </Show>
      <Show when={total > 0}>
        <Link href={LINKS.menu} className={c}>
          {`${list.length} ${plural("item", list.length)} $${total.toFixed(
            2
          )} - `}
          Checkout
        </Link>
      </Show>
    </>
  );
}
function FullCheckoutButton() {
  return (
    <CheckoutButton
      className={`text-md  block w-full rounded-md border-2 border-white px-3 py-2 text-center font-medium text-white`}
    />
  );
}
export function CustomerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const router = useRouter();
  // const isActive = (path: string) => router.pathname === path;

  // <CheckoutButton className="text-md w-full rounded-md border-2 border-white bg-blue-300 px-3 py-2 font-medium text-white" />
  return (
    <nav className="sticky top-0 mb-8 bg-gradient-to-r from-indigo-600 to-pink-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center ">
          <div className="ml-2 flex w-full grow items-center justify-between align-baseline max-sm:block">
            <div className="max-sm:hidden">
              <BrandHead />
            </div>
            <div className="max-sm:hidden">
              <CheckoutButton />
            </div>
            <div className="sm:hidden">
              <FullCheckoutButton />
            </div>
          </div>
          <div className={/*`hidden md:block`*/ "hidden"}>
            {/* Other optional content like profile, etc. */}
          </div>
          {/* <ShoppingCartButton /> */}
          <div className={"hidden"}>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href={LINKS.menu}
              className="block rounded-md px-3 py-2 text-base font-medium text-white"
            >
              Menu
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

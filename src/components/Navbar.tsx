import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/admin/menu"
                  className={`text-md rounded-md px-3 py-2 font-medium hover:text-blue-500 ${
                    isActive("/admin/menu")
                      ? "bold text-blue-300 underline"
                      : "text-white"
                  }`}
                >
                  Menu
                </Link>
                <Link
                  href="/admin/payments"
                  className={`text-md rounded-md px-3 py-2 font-medium  hover:text-blue-500 ${
                    isActive("/admin/payments")
                      ? "bold text-blue-300 underline"
                      : "text-white"
                  }`}
                >
                  Payments
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Other optional content like profile, etc. */}
          </div>
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
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/menu"
              className="block rounded-md px-3 py-2 text-base font-medium text-white"
            >
              Menu
            </Link>
            <Link
              href="/admin/payments"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

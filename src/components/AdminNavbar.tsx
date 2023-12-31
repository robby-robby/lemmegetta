import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { ReactNode, useState } from "react";
import { BrandHead } from "~/components/BrandHead";
import { LINKS } from "~/components/links";
interface NavLinksParentProps {
  onClick: () => void;
  children: ReactElement<{ onClick: () => void }>[];
}
const NavLinksMobileParent: React.FC<NavLinksParentProps> = ({
  onClick,
  children,
}) => {
  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as ReactElement<{ onClick: () => void }>, {
              onClick,
            })
          : child
      )}
    </>
  );
};

const NavLinkMobile = ({
  href,
  name,
  onClick,
}: {
  href: string;
  name: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
  >
    {name}
  </Link>
);

const NavLink = ({ name, href }: { name: string; href: string }) => {
  const router = useRouter();

  const active = (path: string, yesClass: string, noClass = "") =>
    router.pathname === path ? yesClass : noClass;

  return (
    <Link
      href={href}
      className={`text-md hover:indigo-200 mx-3 rounded-md px-3 py-2 font-medium text-white ${active(
        href,
        "border-2 border-white"
      )}`}
    >
      {name}
    </Link>
  );
};
export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const

  return (
    <>
      <nav className="sticky top-0 z-50 mb-8 bg-gradient-to-r from-indigo-600 to-pink-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center ">
            <div className="ml-2 flex w-full justify-between align-baseline">
              <BrandHead />
              <div className="hidden sm:flex">
                <NavLink name="Preview Menu" href={LINKS.adminView} />
                <NavLink name="Edit Menu" href={LINKS.adminMenu} />
                <NavLink name="Payments" href={LINKS.payments} />
              </div>
            </div>
            <div className="hidden md:block">
              {/* Other optional content like profile, etc. */}
            </div>
            <div className="-mr-2 flex sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-gray inline-flex items-center justify-center rounded-md  border-2 p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
          <div className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <NavLinksMobileParent onClick={() => setIsOpen(false)}>
                <NavLinkMobile name="Menu" href={LINKS.adminMenu} />
                <NavLinkMobile name="Settings" href={LINKS.payments} />
                <NavLinkMobile name="Preview Menu" href={LINKS.menu} />
              </NavLinksMobileParent>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

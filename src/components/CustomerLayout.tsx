import { useRouter } from "next/navigation";
import React, { type ReactNode } from "react";
import { CustomerNavbar } from "~/components/CustomerNavbar";

type CustomerLayoutProps = {
  children: ReactNode;
  page?: string;
};

const CustomerLayout = ({ children, page }: CustomerLayoutProps) => {
  return (
    <>
      <CustomerNavbar page={page} />
      <main>{children}</main>
    </>
  );
};

export default CustomerLayout;

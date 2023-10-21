import React, { type ReactNode } from "react";
import { CustomerNavbar } from "~/components/CustomerNavbar";

type CustomerLayoutProps = {
  children: ReactNode;
};

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <>
      <CustomerNavbar />
      <main>{children}</main>
    </>
  );
};

export default CustomerLayout;

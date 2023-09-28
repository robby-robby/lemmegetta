import React, { type ReactNode } from "react";
import Navbar from "~/components/Navbar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default AdminLayout;

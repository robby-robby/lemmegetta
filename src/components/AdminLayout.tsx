import React, { type ReactNode } from "react";
import { AdminNavbar } from "./AdminNavbar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
};

export default AdminLayout;

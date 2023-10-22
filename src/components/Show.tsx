import React from "react";

export const Show = ({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) => <>{when ? children : null}</>;

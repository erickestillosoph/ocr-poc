import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { paths } from "@/shared/path";

interface Props {
  children: ReactNode;
}

export const NotFoundGuard = ({ children }: Props) => {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <Navigate to={paths.home} />;
  }

  return <>{children}</>;
};

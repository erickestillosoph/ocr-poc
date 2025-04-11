import { MainLayoutPage } from "./ui/main-layout-ui";

type MainLayoutContainerProps = {
  children: React.ReactNode;
};

export const MainLayoutContainer = ({ children }: MainLayoutContainerProps) => {
  return <MainLayoutPage children={children} />;
};

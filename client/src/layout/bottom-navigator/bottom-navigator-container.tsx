import { BottomNavigationBar } from "./ui/bottom-navigator-ui";
import { driverNavigationItems } from "./ui/navigation-items";

export const BottomNavigatorContainer = () => {
  return <BottomNavigationBar navigationItems={driverNavigationItems} />;
};

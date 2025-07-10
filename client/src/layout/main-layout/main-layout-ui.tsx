import { useAppTheme } from "@/shared/theme";
import { Box } from "@chakra-ui/react";
import { BottomNavigationBar, NavigationItems } from "../bottom-navigator";

type MainLayoutPageProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutPageProps) => {
  const { theme } = useAppTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      w="100vw"
      h="100svh"
      backgroundColor={theme.colors.background}
    >
      <Box
        flex="1"
        w="full"
        h="full"
       
      >
        {children}
      </Box>
      <BottomNavigationBar navigationItems={NavigationItems} />
    </Box>
  );
};

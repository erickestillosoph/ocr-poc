import { BottomNavigatorContainer } from "@/layout/bottom-navigator";
import { Header } from "@/layout/header";
import { paths } from "@/shared";
import { useAppTheme } from "@/shared/theme";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

type MainLayoutPageProps = {
  children: React.ReactNode;
};


export const MainLayoutPage = ({ children }: MainLayoutPageProps) => {
  const { theme } = useAppTheme();
  const location = useLocation();
  const isBottomNavigatorShow = location.pathname !== paths.cameraAccessUploadFile;
  return (
    <Box
      display="flex"
      flexDirection="column"
      w="100vw"
      h="100svh"
      backgroundColor={theme.colors.background}
    >
      <Header />
      <Box
        flex="1"
        w="full"
        h="full"

      >
        {children}
      </Box>
      {isBottomNavigatorShow && <BottomNavigatorContainer  />}
    </Box>
  );
};

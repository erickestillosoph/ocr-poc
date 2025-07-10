import { BottomNavigatorContainer } from "@/layout/bottom-navigator";
import { useAppTheme } from "@/shared/theme";
import { Box } from "@chakra-ui/react";

type MainLayoutPageProps = {
  children: React.ReactNode;
};

export const MainLayoutPage = ({ children }: MainLayoutPageProps) => {
  const { theme } = useAppTheme();
  return (
    <Box
      style={{
        margin: "0",
        padding: "12px",
      }}
      height="100%"
      backgroundColor={theme.colors.white}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
        position="relative"
        backgroundColor={theme.colors.white}
      >
        {children}

        <BottomNavigatorContainer />
      </Box>
    </Box>
  );
};

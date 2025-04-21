import { BottomNavigatorContainer } from "@/layout/bottom-navigator";
import { useAppTheme } from "@/shared/theme";
import { VStack } from "@chakra-ui/react";

type MainLayoutPageProps = {
  children: React.ReactNode;
};

export const MainLayoutPage = ({ children }: MainLayoutPageProps) => {
  const { theme } = useAppTheme();
  return (
    <VStack height="full" w="full" backgroundColor={theme.colors.white}>
      <VStack
        alignItems="center"
        justifyContent="center"
        spacing="16px"
        w="full"
        h="full"
        position="relative"
        backgroundColor={theme.colors.white}
      >
        {children}
        <BottomNavigatorContainer />
      </VStack>
    </VStack>
  );
};

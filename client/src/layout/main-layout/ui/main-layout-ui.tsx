import { BottomNavigatorContainer } from "@/layout/bottom-navigator";
import { VStack } from "@chakra-ui/react";

type MainLayoutPageProps = {
  children: React.ReactNode;
};

export const MainLayoutPage = ({ children }: MainLayoutPageProps) => {
  return (
    <VStack height="full">
      <VStack spacing="16px" w="full" h="full" position="relative">
        {children}
        <BottomNavigatorContainer />
      </VStack>
    </VStack>
  );
};

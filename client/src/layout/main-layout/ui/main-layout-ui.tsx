import { BottomNavigatorContainer } from "@/layout/bottom-navigator";
import { CameraAccessContainer } from "@/pages";
import { VStack } from "@chakra-ui/react";

export const MainLayoutPage = () => {
  return (
    <VStack display="grid" alignContent="space-between" height="full">
      <VStack alignItems="flex-start" spacing="16px">
        <CameraAccessContainer />
      </VStack>
      <BottomNavigatorContainer />
    </VStack>
  );
};

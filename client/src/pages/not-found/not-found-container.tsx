import { NotFoundContainer } from "@/features";
import { NotFoundPage } from "./not-found-page";
import { VStack } from "@chakra-ui/react";

export const NotFoundPageContainer = () => {
  return (
    <VStack justifyContent="center" alignItems="center" height="100%">
      <NotFoundPage stubSlot={<NotFoundContainer title="404エラー画面" />} />
    </VStack>
  );
};

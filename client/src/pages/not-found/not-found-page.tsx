import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  stubSlot: ReactNode;
};

export const NotFoundPage = ({ stubSlot }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {stubSlot}
    </Box>
  );
};

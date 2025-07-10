import { useRoutes } from "react-router-dom";
import { routes } from "@/routes/routes";
import { Box } from "@chakra-ui/react";

export const AppRoute = () => {
  const element = useRoutes(routes);
  return (
    <Box w="100%" h="full">
      {element}
    </Box>
  );
};

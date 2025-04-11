import { theme as ChakraTheme } from "@chakra-ui/react";

import { colors } from "./colors";

export const theme = {
  colors: {
    ...ChakraTheme.colors,
    ...colors.common,
  },
} as const;

import { colors } from "./colors";

import { theme } from "./theme";

export const useAppTheme = () => {
  return {
    theme: {
      colors: {
        ...theme.colors,
        ...colors.common,
      },
    },
  };
};

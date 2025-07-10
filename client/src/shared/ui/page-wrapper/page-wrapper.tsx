import { useAppTheme } from '@/shared/theme';
import { Box } from '@chakra-ui/react';
type Props = {
  children: React.ReactNode;
};

export const PageWrapper = ({ children }: Props) => {
  const { theme } = useAppTheme();
  return (
    <Box 
      bg={theme.colors.background} 
      h="100vh" 
      w="100vw" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      padding="16px"
    >
      <Box w="full" maxW="800px" minW="320px">
        {children}
      </Box>
    </Box>
  );
};

import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import { useCallback } from "react";
import { CenterSpinner } from "@/shared";
import { useImageCaptureMutation } from "../hooks/use-capture-mutation";



export const CameraAccessPage = () => {
  const { theme } = useAppTheme();
  const {
    mutate,
    isPending: isCameraPending,
  } = useImageCaptureMutation();

  const handleOpenCamera = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (base64) {
            mutate([base64]);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }, [mutate]);

  return (
    <VStack w="100%">
      <CenterSpinner loading={isCameraPending} />
      <Box px="16px" w="full">
        <Button
          w="full"
          color={theme.colors.white}
          backgroundColor={theme.colors.blue}
          onClick={handleOpenCamera}
          _hover={{
            color: "blue.500",
            backgroundColor: "transparent",
          }}
          gap="8px"
        >
          写真を撮影
        </Button>
      </Box>
    </VStack>
  );
};

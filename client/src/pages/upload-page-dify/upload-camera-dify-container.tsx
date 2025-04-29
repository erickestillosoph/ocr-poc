import { Box } from "@chakra-ui/react";
import { CameraAccessDifyContainer } from "../camera-access";
import { useAppTheme } from "@/shared/theme";
import { UploadPageDifyContainer } from "./upload-page-dify-container";
import { useState } from "react";

export const UploadCameraDifyContainer = () => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <Box
      w="100%"
      h="100%"
      backgroundColor={theme.colors.white}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <CameraAccessDifyContainer
        isImageCapture={isCameraOpen}
        isHandleCameraOpen={(isCameraOpen) => setIsCameraOpen(isCameraOpen)}
      />
      <UploadPageDifyContainer />
    </Box>
  );
};

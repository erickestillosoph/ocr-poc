import { Box } from "@chakra-ui/react";
import { CameraAccessContainer } from "../camera-access";
import { useAppTheme } from "@/shared/theme";
import { UploadPageContainer } from "./upload-page-container";
import { useState } from "react";

export const UploadCameraContainer = () => {
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
      <CameraAccessContainer
        isImageCapture={isCameraOpen}
        isHandleCameraOpen={(isCameraOpen) => setIsCameraOpen(isCameraOpen)}
      />
      <UploadPageContainer />
    </Box>
  );
};

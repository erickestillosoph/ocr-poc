import { Box } from "@chakra-ui/react";
import { CameraAccessDifyContainer } from "../camera-access";
import { useAppTheme } from "@/shared/theme";
import { UploadPageDifyContainer } from "./upload-page-dify-container";
import { useState } from "react";

export const UploadCameraDifyContainer = () => {
  const { theme } = useAppTheme();
  //TODO: Hide this block of code
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
      //TODO: Hide this block of code
      <CameraAccessDifyContainer
        isImageCapture={isCameraOpen}
        isHandleCameraOpen={(isCameraOpen) => setIsCameraOpen(isCameraOpen)}
      />
      <UploadPageDifyContainer />
    </Box>
  );
};

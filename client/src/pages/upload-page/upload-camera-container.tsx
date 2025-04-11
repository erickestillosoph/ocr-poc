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
      display="flex"
      flexDirection="column"
      width="100%"
      backgroundColor={theme.colors.white}
    >
      <CameraAccessContainer
        isHandleCameraOpen={(isCameraOpen) => setIsCameraOpen(isCameraOpen)}
      />
      {!isCameraOpen && <UploadPageContainer />}
    </Box>
  );
};

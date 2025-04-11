import { Box } from "@chakra-ui/react";
import { CameraAccessContainer } from "../camera-access";
import { useAppTheme } from "@/shared/theme";
import { UploadPageContainer } from "./upload-page-container";

export const UploadCameraContainer = () => {
  const { theme } = useAppTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      width="full"
      backgroundColor={theme.colors.white}
    >
      <CameraAccessContainer />
      <UploadPageContainer />
    </Box>
  );
};

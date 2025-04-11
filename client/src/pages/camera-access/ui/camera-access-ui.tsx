import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import { useState } from "react";
import { useCameraAccess } from "../hooks/use-camera-access-2";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const CameraAccessPage = () => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { capture, webcamRef } = useCameraAccess();

  const handleOpenCamera = () => setIsCameraOpen(true);

  return (
    <VStack height="full" w="full">
      <VStack spacing="16px">
        {isCameraOpen ? (
          <Box>
            <Webcam
              audio={false}
              height={720}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
              ref={webcamRef}
            ></Webcam>
            <Button
              color={theme.colors.white}
              backgroundColor={theme.colors.blue}
              w="full"
              position="relative"
              zIndex="1"
              onClick={capture}
            >
              <span>Capture</span>
            </Button>
          </Box>
        ) : (
          <Button
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            w="full"
            zIndex="1"
            onClick={handleOpenCamera}
          >
            <span>写真を撮影</span>
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import React, { useRef, useState } from "react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const CameraAccessPage = () => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  }, [webcamRef]);

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
            <span>open camera</span>
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

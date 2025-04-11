import { Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import React, { useRef } from "react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const CameraAccessPage = () => {
  const { theme } = useAppTheme();
  const webcamRef = useRef<Webcam>(null);
  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  }, [webcamRef]);
  return (
    <VStack display="grid" alignContent="space-between" height="full">
      <VStack alignItems="flex-start" spacing="16px">
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
          <span>open camera</span>
        </Button>
      </VStack>
    </VStack>
  );
};

import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import { useCallback, useState } from "react";
import { useCameraAccess } from "../hooks/use-camera-access-2";
import { IoMdCamera } from "react-icons/io";
const videoConstraints = {
  width: 365,
  height: 500,
  facingMode: { exact: "environment" },
  // back camera phone
};

export type CameraAccessPageProps = {
  isHandleCameraOpen: (isCameraOpen: boolean) => void;
};

export const CameraAccessPage = ({
  isHandleCameraOpen,
}: CameraAccessPageProps) => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { capture, webcamRef } = useCameraAccess();

  const handleOpenCamera = useCallback(() => {
    setIsCameraOpen(true);
    isHandleCameraOpen(true);
  }, [isHandleCameraOpen]);

  return (
    <VStack height="full" w="full">
      {isCameraOpen ? (
        <Box>
          <Webcam
            audio={false}
            height="100%"
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={videoConstraints}
            ref={webcamRef}
            style={{
              borderRadius: "20px",
              boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            }}
          ></Webcam>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              cursor="pointer"
              borderRadius="full"
              mt="16px"
              bottom="24px"
              bgColor="white"
              p="16px"
              onClick={capture}
              _hover={{
                backgroundColor: "gray.100",
              }}
              transition="ease .3s"
            >
              <IoMdCamera size="36px" color="black" />
            </Box>
          </Box>
        </Box>
      ) : (
        <Button
          color={theme.colors.white}
          backgroundColor={theme.colors.blue}
          w="full"
          onClick={handleOpenCamera}
          _hover={{
            color: "blue.500",
            backgroundColor: "transparent",
          }}
          gap="8px"
        >
          写真を撮影
        </Button>
      )}
    </VStack>
  );
};

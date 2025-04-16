import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import { useCallback, useState, useEffect } from "react";
import { useCameraAccess } from "../hooks/use-camera-access";
import { IoMdCamera } from "react-icons/io";
import { CenterSpinner } from "@/shared";
import { useImageCaptureMutation } from "../hooks/use-capture-mutation";

export type CameraAccessPageProps = {
  isHandleCameraOpen: (isCameraOpen: boolean) => void;
};

export const CameraAccessPage = ({
  isHandleCameraOpen,
}: CameraAccessPageProps) => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const isDesktop = window.innerWidth > 1024;

  const videoConstraints = {
    width: 350,
    height: 650,
    aspectRatio: 0.615,
    facingMode: isDesktop ? "user" : { exact: "environment" },
  };

  const { capture, webcamRef, imageSrcInBase64 } = useCameraAccess();
  const {
    mutate,
    isPending: isCameraPending,
    openImageRef,
  } = useImageCaptureMutation();

  const handleOpenCamera = useCallback(() => {
    setIsCameraOpen(true);
    isHandleCameraOpen(true);
  }, [isHandleCameraOpen, setIsCameraOpen]);

  useEffect(() => {
    openImageRef.current?.();
    if (imageSrcInBase64) {
      mutate([imageSrcInBase64]);
      setIsCameraOpen(false);
    }
  }, [mutate, openImageRef, imageSrcInBase64]);

  return (
    <VStack height="full" w="full">
      <CenterSpinner loading={isCameraPending} />
      {isCameraOpen ? (
        <Box height="full" w="full">
          <Webcam
            audio={false}
            height="100%"
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={videoConstraints}
            ref={webcamRef}
            allowFullScreen={true}
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

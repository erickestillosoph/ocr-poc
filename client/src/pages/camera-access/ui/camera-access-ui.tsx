import { Box, Button, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import Webcam from "react-webcam";
import { useCallback, useState, useEffect } from "react";
import { useCameraAccess } from "../hooks/use-camera-access";
import { IoMdCamera } from "react-icons/io";
import { useCameraImageMutation } from "../hooks/use-camera-mutation";
import { CenterSpinner } from "@/shared";
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth < 1024;
const isDesktop = window.innerWidth > 1024;

const phoneScreenWidth = window.innerWidth - 50;
const phoneScreenHeight = window.innerHeight - 50;
const tabletScreenWidth = window.innerWidth - 100;
const tabletScreenHeight = window.innerHeight - 100;
const desktopScreenWidth = window.innerWidth - 100;
const desktopScreenHeight = window.innerHeight - 100;
const videoConstraints = {
  width: isMobile
    ? phoneScreenWidth
    : isTablet
    ? tabletScreenWidth
    : desktopScreenWidth,
  height: isMobile
    ? phoneScreenHeight
    : isTablet
    ? tabletScreenHeight
    : desktopScreenHeight,
  aspectRatio: 1,
  facingMode: isDesktop ? "user" : { exact: "environment" },
};

export type CameraAccessPageProps = {
  isHandleCameraOpen: (isCameraOpen: boolean) => void;
};

export const CameraAccessPage = ({
  isHandleCameraOpen,
}: CameraAccessPageProps) => {
  const { theme } = useAppTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { capture, webcamRef, imageSrc } = useCameraAccess();
  const { mutate, isPending } = useCameraImageMutation();
  const handleOpenCamera = useCallback(() => {
    setIsCameraOpen(true);
    isHandleCameraOpen(true);
  }, [isHandleCameraOpen, setIsCameraOpen]);

  useEffect(() => {
    if (imageSrc) {
      mutate(imageSrc);
    }
  }, [imageSrc, mutate, capture]);

  return (
    <VStack height="full" w="full">
      <CenterSpinner loading={isPending} />
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

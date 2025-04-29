import { Box, Button, Input, Spacer, useToast, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import { useCallback, useEffect, useState } from "react";
import { base64ToFile, CenterSpinner } from "@/shared";
import Webcam from "react-webcam";
import { IoMdCamera } from "react-icons/io";
import { useDetectDevice } from "@/shared/utils/use-detect-device";
import { useCameraAccess } from "../hooks/use-camera-access";
import { useImageCaptureDifyMutation } from "../hooks/use-capture-dify-mutation";
import { useImageDifyMutation } from "../hooks/use-image-dify-mutation";
export type CameraAccessPageProps = {
  isHandleCameraOpen: (isCameraOpen: boolean) => void;
  isImageCapture: boolean;
};

export const CameraAccessPageDify = ({
  isHandleCameraOpen,
  isImageCapture,
}: CameraAccessPageProps) => {
  console.log(isHandleCameraOpen);
  console.log(isImageCapture);
  const toast = useToast();

  const { theme } = useAppTheme();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const isDesktop = window.innerWidth > 1024;
  const device = useDetectDevice();
  const hasMobileDevice = !/Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

  const shouldDimensionMobile = (
    isWindowWidth: "desktop" | "mobile" | "user"
  ) => {
    if (isWindowWidth === "mobile") {
      return {
        width: 610,
        height: 395,
      };
    }
    if (isWindowWidth === "desktop") {
      return {
        width: 395,
        height: 610,
      };
    }
    return {
      width: 610,
      height: 395,
    };
  };

  const videoConstraints = {
    width: hasMobileDevice
      ? shouldDimensionMobile("desktop").width
      : !hasMobileDevice
      ? shouldDimensionMobile("mobile").width
      : shouldDimensionMobile("user").width,
    height: hasMobileDevice
      ? shouldDimensionMobile("desktop").height
      : !hasMobileDevice
      ? shouldDimensionMobile("mobile").height
      : shouldDimensionMobile("user").height,
    aspectRatio: device.aspectRatio,
    facingMode: "environment",
  };

  const { capture, webcamRef, imageSrcInBase64 } = useCameraAccess();
  const { mutate: mutateImage, isPending: isCameraPending } =
    useImageCaptureDifyMutation();

  const {
    isPending: isPendingImageCapture,
    getInputProps,
    openImageRef: openImageRefDrop,
  } = useImageDifyMutation();

  const handleOpenCamera = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsCameraOpen(true);
      isHandleCameraOpen(true);
    },
    [isHandleCameraOpen, setIsCameraOpen]
  );

  useEffect(() => {
    const run = async () => {
      if (imageSrcInBase64) {
        const imageFile = await base64ToFile(imageSrcInBase64, "image.jpg");
        mutateImage(imageFile);
        setIsCameraOpen(false);
      }
    };
    run();
  }, [imageSrcInBase64, mutateImage, toast, isPendingImageCapture]);

  return (
    <VStack w="100%">
      <CenterSpinner loading={isCameraPending || isPendingImageCapture} />
      {!isCameraOpen && !isDesktop && (
        <Input
          display="none"
          {...getInputProps({
            id: "image",
            name: "image",
            capture: "environment",
            type: "file",
            accept: "image/*",
            multiple: false,
          })}
          size="md"
        />
      )}

      {!isCameraOpen && !isDesktop && (
        <Box px="16px" w="full">
          <Button
            w="full"
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            onClick={() => {
              openImageRefDrop.current?.();
            }}
            _hover={{
              color: "blue.500",
              backgroundColor: "transparent",
            }}
            gap="8px"
          >
            写真を撮影
          </Button>
        </Box>
      )}

      {isCameraOpen ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="full"
          w="full"
        >
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            ref={webcamRef}
            allowFullScreen={true}
            style={{
              height: isDesktop ? "460px" : "460px",
              width: isDesktop ? "300px" : "300px",
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
              onClick={capture}
              _hover={{
                backgroundColor: "gray.100",
              }}
              transition="ease .3s"
            >
              <IoMdCamera size="36px" color="black" />
            </Box>
          </Box>
          <Spacer />
        </Box>
      ) : (
        hasMobileDevice && (
          <Box px="16px" w="full">
            <Button
              w="full"
              color={theme.colors.white}
              backgroundColor={theme.colors.blue}
              onClick={handleOpenCamera}
              _hover={{
                color: "blue.500",
                backgroundColor: "transparent",
              }}
              gap="8px"
            >
              写真を撮影
            </Button>
          </Box>
        )
      )}
    </VStack>
  );
};

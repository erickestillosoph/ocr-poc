import { Box, VStack } from "@chakra-ui/react";
import Webcam from "react-webcam";
import { useEffect } from "react";
import { useCameraAccess } from "../hooks/use-camera-access";
import { IoMdCamera } from "react-icons/io";
import { CenterSpinner } from "@/shared";
import { useImageCaptureMutation } from "../hooks/use-capture-mutation";

export const CameraAccessPage = () => {
  const isDesktop = window.innerWidth > 1024;

  const videoConstraints = {
    width: 350,
    height: 650,
    aspectRatio: 0.615,
    facingMode:isDesktop ? "user" : { exact: "environment" },
  };

  const { capture, webcamRef, imageSrcInBase64 } = useCameraAccess();
  const {
    mutate,
    isPending: isCameraPending,
    openImageRef,
  } = useImageCaptureMutation();

  useEffect(() => {
    openImageRef.current?.();
    if (imageSrcInBase64) {
      mutate([imageSrcInBase64]);
    }
  }, [mutate, openImageRef, imageSrcInBase64]);

  return (
   <VStack
  w="full"
  h="100vh"
  overflow="hidden"
  position="relative"
  justifyContent="space-between"
  alignItems="center"
  spacing="12px"
>
  <CenterSpinner loading={isCameraPending} />

  <Box w="full" flex="1">
    <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      ref={webcamRef}
      allowFullScreen={true}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </Box>
  <Box
    cursor="pointer"
    borderRadius="full"
    bgColor="white"
    p="16px"
    onClick={capture}
    _hover={{ backgroundColor: "gray.100" }}
    transition="ease .3s"
    mb="24px"

  >
    <IoMdCamera size="36px" color="black" />
  </Box>
</VStack>

  )  
};

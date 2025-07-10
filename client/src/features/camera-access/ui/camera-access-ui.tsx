import { Box, Button, Input, Spacer, VStack } from "@chakra-ui/react";
import { useAppTheme } from "@/shared/theme";
import { useCallback, useEffect, useState } from "react";
import { CenterSpinner } from "@/shared";
import Webcam from "react-webcam";
import { IoMdCamera } from "react-icons/io";
import { useDetectDevice } from "@/shared/utils/use-detect-device";
import { useImageCaptureMutation } from "../hooks/use-capture-mutation";
import { useCameraAccess } from "../hooks/use-camera-access";
import { useImageMutation } from "../hooks/use-image-mutation";
export type CameraAccessPageProps = {
  isHandleCameraOpen: (isCameraOpen: boolean) => void;
  isImageCapture: boolean;
};

export const CameraAccessPage = ({
  isHandleCameraOpen,
  isImageCapture,
}: CameraAccessPageProps) => {
  console.log(isHandleCameraOpen);
  console.log(isImageCapture);
  // const isTemp = false;

  // const captureFileInputRef = useRef<HTMLInputElement | null>(null);
  const { theme } = useAppTheme();
  // const { handleImageConversion } = useImageUploader();
  // const camera = useRef<CameraType>(null);
  // const [numberOfCameras, setNumberOfCameras] = useStaste(0);
  // const [image, setImage] = useState<string>();
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
    useImageCaptureMutation();
  const {
    isPending: isPendingImageCapture,
    getInputProps,
    openImageRef: openImageRefDrop,
  } = useImageMutation();

  const handleOpenCamera = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsCameraOpen(true);
      isHandleCameraOpen(true);
    },
    [isHandleCameraOpen, setIsCameraOpen]
  );

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     mutateImage(event.target.files[0]);
  //   }
  // };
  // const processImage = useCallback(async () => {
  //   if (isImageCapture) {
  //     // fileInputRef.current?.click();
  //     if (resultsFile) {
  //       const base64File = await fileToBsase64(resultsFile);
  //       // mutateImage(base64File);
  //     }
  //   }
  // }, [isImageCapture, resultsFile, mutateImage]);

  // const takePhoto = useCallback(() => {
  //   if (camera.current) {
  //     const photo = camera.current.takePhoto();
  //     setImage(
  //       typeof photo === "string"
  //         ? photo
  //         : URL.createObjectURL(new Blob([photo.data.buffer]))
  //     );
  //   }
  // }, [camera]);

  // const switchCamera = useCallback(() => {
  //   if (camera.current) {
  //     camera.current.switchCamera();
  //   }
  // }, [camera]);

  // const handleUploadClick = () => {
  //   if (captureFileInputRef.current) {
  //     captureFileInputRef.current.click();
  //   }
  // };

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];

  //   if (!file || file.size === 0) {
  //     alert(`No file selected 2`);
  //     return;
  //   }

  //   try {
  //     const base64File = await fileToBase64(file);
  //     await mutateImage([base64File.toString()]);
  //   } catch (error) {
  //     alert(`Error: `);
  //     console.error(error);
  //   }
  // };

  // const isImage =
  //   file.type === "image/jpeg" ||
  //   file.type === "image/jpg" ||
  //   file.type === "image/png" ||
  //   file.name.endsWith(".jpeg") ||
  //   file.name.endsWith(".jpg") ||
  //   file.name.endsWith(".png");

  // if (!isImage) handleImageConversion(file);

  // if (isImage) {
  //   // mutateImage(file);
  // } else {
  //   //  mutateImage(convertedImage!);
  // }

  useEffect(() => {
    if (imageSrcInBase64) {
      mutateImage([imageSrcInBase64]);
      setIsCameraOpen(false);
    }
  }, [openImageRefDrop, imageSrcInBase64, mutateImage]);

  return (
    <VStack w="100%">
      <CenterSpinner loading={isCameraPending || isPendingImageCapture} />
      {/* {isTemp && (
        <Input
          name="image"
          id="image"
          ref={captureFileInputRef}
          type="file"
          accept=".jpg, .jpeg, .png, .heic, .heif"
          capture="environment"
          style={{ visibility: "hidden" }}
          // onChangeCapture={handleFileChange}
        />
      )} */}

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
      {/* 
      <Box px="16px" w="full">
        <Button
          w="full"
          color={theme.colors.white}
          backgroundColor={theme.colors.blue}
          onClick={handleUploadClick}
          _hover={{
            color: "blue.500",
            backgroundColor: "transparent",
          }}
          gap="8px"
        >
          Button Drop
        </Button>
      </Box> */}

      {!isCameraOpen && !isDesktop && !hasMobileDevice && (
        <Box px="16px" w="full">
          <Button
            w="full"
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            // onClick={handleUploadClick}
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

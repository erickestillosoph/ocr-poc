import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPaths } from "@/shared/config/api-config";

export const useCameraImageMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadCameraImage;

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    data: cameraImageData,
  } = useMutation({
    mutationFn: (cameraImageStringBase64: string) => {
      const data = new FormData();
      data.append("cameraImage", cameraImageStringBase64);
      return apiClient.post(IMAGE_PATH, data);
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: `Your image base64 has been uploaded successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate(paths.viewResultsPage);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: `There was an error uploading your image.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    mutationKey: ["cameraImage"],
  });

  if (isSuccess) {
    setLocalStorage("cameraImageResults", cameraImageData?.data);
    setLocalStorage("cameraImageResultsTimestamp", Date.now());
  }
  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    cameraImageDataResults: cameraImageData?.data,
  };
};

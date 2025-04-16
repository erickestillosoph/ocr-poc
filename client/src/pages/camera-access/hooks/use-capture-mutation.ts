import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPaths } from "@/shared/config/api-config";

export const useImageCaptureMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImage;

  const openImageRef = useRef<() => void | null>(null);

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (files: string[]) => {
      const data = new FormData();
      files.forEach((file) => data.append("image", file));
      return apiClient.post(IMAGE_PATH, data);
    },
    onSuccess: (data) => {
      setLocalStorage("cameraImageResultsTimestamp", Date.now());
      setLocalStorage("cameraImageResults", data.data);
      toast({
        title: "Upload successful",
        description: `Your image has been uploaded successfully.`,
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
    mutationKey: ["image"],
  });

  return {
    mutate: mutateAsync,
    isPending,
    isError,
    isSuccess,
    openImageRef,
  };
};

import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPaths } from "@/shared/config/api-config";
import { fileToBase64 } from "@/shared";

export const useImageMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImage;

  const openImageRef = useRef<() => void | null>(null);

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data: imageData,
  } = useMutation({
    mutationFn: async (file: File) => {
      // Convert the file to Base64
      const base64File = await fileToBase64(file);

      return apiClient.post(IMAGE_PATH, {
        image: base64File, // Send the Base64-encoded image to the backend
      });
    },

    onSuccess: (data) => {
      setLocalStorage("imageResults", data.data);
      setLocalStorage("imageResultsTimestamp", Date.now());

      toast({
        title: "アップロード成功.",
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // Get the first file, as there should only be one

      // Proceed with the mutation
      mutateAsync(file);

      toast({
        title: "アップロード成功.",
        description: file.name,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    [mutateAsync, toast]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxFiles: 3,
  });

  openImageRef.current = open;

  return {
    getRootProps,
    getInputProps,
    mutate: mutateAsync,
    isPending,
    isError,
    isSuccess,
    openImageRef,
    imageResults: imageData?.data,
  };
};

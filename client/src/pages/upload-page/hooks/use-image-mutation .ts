import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api, paths } from "@/shared";
import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const useImageMutation = () => {
  const toast = useToast();
  const IMAGE_PATH = api.uploadImage;
  const navigate = useNavigate();

  const openImageRef = useRef<() => void | null>(null);
  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    data: imageData,
  } = useMutation({
    mutationFn: (files: File[]) => {
      const data = new FormData();
      files.forEach((file) => data.append("image", file));
      return axios.post(`${API_URL}/${API_VERSION}${IMAGE_PATH}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
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
    onError: () => {
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
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        toast({
          title: "File uploaded",
          description: file.name,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });

      mutate(acceptedFiles);
    },
    [toast, mutate]
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
    mutate,
    isPending,
    isError,
    isSuccess,
    openImageRef,
    imageResults: imageData?.data,
  };
};

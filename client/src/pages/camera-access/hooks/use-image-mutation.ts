import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPaths } from "@/shared/config/api-config";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";
import { compressImage, fileToBase64 } from "@/shared";

export const useImageMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImage;

  const openImageRef = useRef<() => void | null>(null);

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data: imageData,
  } = useMutation({
    mutationFn: async (files: string) => {
      const response = await apiClient.post(IMAGE_PATH, {
        image: files,
      });

      return response;
    },
    onSuccess: (data) => {
      setLocalStorage("cameraImageResults", data.data);
      setLocalStorage("cameraImageResultsTimestamp", Date.now());
      toast({
        title: "アップロード成功.",
        description: `「お客様の画像が正常にアップロードされました。」`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate(paths.viewResultsPage);
    },
    onError: (error) => {
      toast({
        title: `「画像のアップロード中にエラーが発生しました。`,
        description: `${error.message} ${error.stack} ${error.name}`,
        status: "error",
        duration: Infinity,
        isClosable: true,
        position: "top",
      });
    },
    mutationKey: ["image"],
  });

  const accept: Accept = {
    "image/jpeg": [],
    "image/png": [],
    "image/jpg": [],
    "image/heic": [],
    "image/heif": [],
    "image/hevc": [],
    "image/heic-sequence": [],
    "image/heif-sequence": [],
    "image/hevc-sequence": [],
  };
  const options: DropzoneOptions = {
    accept,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    onDropRejected: () => {
      toast({
        title: "画像のアップロードに失敗しました。",
        description: "画像のサイズが大きすぎるか、形式が正しくありません。",
        status: "error",
        duration: 3000,
      });
    },
    onDropAccepted: async (acceptedFiles) => {
      const base64Files = await Promise.all(
        acceptedFiles.map((file) => fileToBase64(file))
      );
      const stringyFiedBase64Files = base64Files[0].toString();
      const compressedImage = await compressImage(stringyFiedBase64Files);
      mutate(compressedImage);
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  };
  const { getRootProps, getInputProps, open } = useDropzone(options);
  openImageRef.current = open;
  // const dataFromDropZones = inputRef.current?.files;

  return {
    getRootProps,
    getInputProps,
    mutate: mutateAsync,
    isPending,
    isError,
    isSuccess,
    openImageRef,
    imageResults: imageData,
  };
};

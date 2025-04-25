import { useMutation } from "@tanstack/react-query";
import { compressImage, paths, setLocalStorage, fileToBase64 } from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, apiPaths } from "@/shared/config/api-config";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";

export const useCameraCaptureMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImage;

  const openImageRef = useRef<() => void | null>(null);
  const inputRefFile = useRef<HTMLInputElement | null>(null);
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
      setLocalStorage("imageResults", data.data);
      setLocalStorage("imageResultsTimestamp", Date.now());
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const base64Files = await Promise.all(
        acceptedFiles.map((file) => fileToBase64(file))
      );
      const stringyFiedBase64Files = base64Files[0].toString();
      const compressedImage = await compressImage(stringyFiedBase64Files);
      mutate(compressedImage);

      toast({
        title: "アップロード成功.",
        description: acceptedFiles[0].name,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    [mutate, toast]
  );
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
    onDrop,
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
    multiple: false,
    noClick: true,
    noKeyboard: true,
  };

  const { getRootProps, getInputProps, open, inputRef } = useDropzone(options);
  openImageRef.current = open;
  inputRefFile.current = inputRef.current;
  return {
    getRootProps,
    getInputProps,
    mutate: mutateAsync,
    isPending,
    isError,
    isSuccess,
    openImageRef,
    imageResults: imageData,
    inputRefFile,
    onDrop,
  };
};

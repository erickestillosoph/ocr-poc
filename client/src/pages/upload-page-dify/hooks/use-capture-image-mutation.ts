import { useMutation } from "@tanstack/react-query";
import {
  base64ToFile,
  compressImage,
  fileToBase64,
  paths,
  setLocalStorage,
} from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiPaths,
  difyApiClient,
  difyApiClientWorkflow,
} from "@/shared/config/api-config";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";

export const useCameraCaptureMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImageDify;
  const WORKFLOW_PATH = apiPaths.uploadWorkflowDify;

  const openImageRef = useRef<() => void | null>(null);
  const inputRefFile = useRef<HTMLInputElement | null>(null);
  const {
    // mutate,
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data: imageData,
  } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user", "sample-user");

      return await difyApiClient.post(IMAGE_PATH, formData);
    },
    onSuccess: async (data) => {
      const fileId = data.data.id;

      const workflowPayload = {
        inputs: {
          file: {
            transfer_method: "local_file",
            upload_file_id: `${fileId}`,
            type: "image",
          },
        },
        response_mode: "blocking",
        user: "sample-user",
      };

      await difyApiClientWorkflow
        .post(WORKFLOW_PATH, workflowPayload)
        .then((res) => {
          setLocalStorage("imageResultsDify", res.data.data);
          setLocalStorage("imageResultsTimestampDify", Date.now());
        });

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
    onError: () => {
      toast({
        title: "「画像のアップロード中にエラーが発生しました。」",
        description: `「お客様の画像のアップロード中にエラーが発生いたしました。」`,
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
      const baseToImage = await base64ToFile(compressedImage, "image.jpg");

      await mutateAsync(baseToImage);

      toast({
        title: "アップロード成功.",
        description: acceptedFiles[0].name,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    [mutateAsync, toast]
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
    ".jpg": [],
    ".png": [],
    ".jpeg": [],
    ".heic": [],
    ".heif": [],
    ".hevc": [],
    ".heic-sequence": [],
  };
  const options: DropzoneOptions = {
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    onDropRejected: () => {
      toast({
        title: "「画像のアップロード中にエラーが発生しました。」",
        description: `「お客様の画像のアップロード中にエラーが発生いたしました。」`,
        status: "error",
        duration: 3000,
      });
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    autoFocus: true,
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

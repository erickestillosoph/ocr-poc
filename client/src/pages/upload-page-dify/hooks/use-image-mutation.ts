import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiPaths,
  difyApiClient,
  difyApiClientWorkflow,
} from "@/shared/config/api-config";

export const useImageMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImageDify;
  const WORKFLOW_PATH = apiPaths.uploadWorkflowDify;

  const openImageRef = useRef<() => void | null>(null);

  const {
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
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "「画像のアップロード中にエラーが発生しました。」",
        description: `「お客様の画像のアップロード中にエラーが発生いたしました。」`,
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
    onDrop,
  };
};

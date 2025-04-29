import { useMutation } from "@tanstack/react-query";
import { paths, setLocalStorage } from "@/shared";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiPaths,
  difyApiClient,
  difyApiClientWorkflow,
} from "@/shared/config/api-config";
import { useDropzone } from "react-dropzone";

export const useImageCaptureDifyMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const IMAGE_PATH = apiPaths.uploadImageDify;
  const WORKFLOW_PATH = apiPaths.uploadWorkflowDify;
  const openImageRef = useRef<() => void | null>(null);

  const { mutateAsync, isPending, isError, isSuccess, reset } = useMutation({
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
          setLocalStorage("cameraImageResultsDify", res.data.data);
          setLocalStorage("cameraImageResultsTimestampDify", Date.now());
        });
      toast({
        title: "Upload successful",
        description: `Your image has been uploaded successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      reset();
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
      reset();
    },
    mutationKey: ["captureImage"],
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
    mutate: mutateAsync,
    getRootProps,
    getInputProps,
    onDrop,
    isPending,
    isError,
    isSuccess,
    openImageRef,
  };
};

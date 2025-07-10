import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { paths, setLocalStorage } from "@/shared";
import {
  apiPaths,
  difyApiClient,
  difyApiClientWorkflow,
} from "@/shared/config/api-config";

export const usePdfMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const PDF_PATH = apiPaths.uploadPdfDify;
  const WORKFLOW_PATH = apiPaths.uploadWorkflowDify;
  const openPDFRef = useRef<() => void>(null);

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data: pdfData,
    reset,
  } = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("user", "sample-user");

      return await difyApiClient.post(PDF_PATH, formData);
    },
    onSuccess: async (data) => {
      const fileId = data.data.id;

      const workflowPayload = {
        inputs: {
          file: {
            transfer_method: "local_file",
            upload_file_id: `${fileId}`,
            type: "document",
          },
        },
        response_mode: "blocking",
        user: "sample-user",
      };

      await difyApiClientWorkflow
        .post(WORKFLOW_PATH, workflowPayload)
        .then((res) => {
          setLocalStorage("pdfResultsDify", res.data.data);
          setLocalStorage("pdfResultsTimestampDify", Date.now());
        });

      toast({
        title: "アップロード成功.",
        status: "success",
        description: `「PDFのアップロードが成功しました。」`,
        isClosable: true,
        position: "top",
      });
      reset();
      navigate(paths.viewResultsPage);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "「画像のアップロード中にエラーが発生しました。」",
        description: `「お客様のPDFのアップロード中にエラーが発生いたしました。」`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      reset();
    },

    mutationKey: ["pdf"],
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        toast({
          title: "アップロード成功.",
          description: file.name,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });

      mutateAsync(acceptedFiles);
    },
    [toast, mutateAsync]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/octet-stream": [],
      "application/x-pdf": [],
      "application/pdf-1.5": [],
      "application/pdf-1.4": [],
      "application/pdf-1.3": [],
      "application/pdf-1.2": [],
      "application/pdf-1.1": [],
      "application/pdf-1.0": [],
      "application/pdf-0.4": [],
    },
    maxFiles: 3,
  });

  openPDFRef.current = open;

  return {
    getRootProps,
    getInputProps,
    mutate: mutateAsync,
    isPending,
    isError,
    isSuccess,
    openPDFRef,
    pdfResults: pdfData?.data,
  };
};

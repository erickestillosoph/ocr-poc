import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/shared";
import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/shared";

const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const usePdfMutation = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const PDF_PATH = api.uploadPdf;
  const openPDFRef = useRef<() => void>(null);
  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    data: pdfData,
  } = useMutation({
    mutationFn: (files: File[]) => {
      const data = new FormData();
      files.forEach((file) => data.append("pdf", file));
      return axios.post(`${API_URL}/${API_VERSION}${PDF_PATH}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: `Your pdf has been uploaded successfully.`,
        status: "success",
        isClosable: true,
        position: "top",
      });
      navigate(paths.viewResultsPage);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: `There was an error uploading your pdf.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },

    mutationKey: ["pdf"],
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
    mutate,
    isPending,
    isError,
    isSuccess,
    openPDFRef,
    pdfResults: pdfData?.data,
  };
};

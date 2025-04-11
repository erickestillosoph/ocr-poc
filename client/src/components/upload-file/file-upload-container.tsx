import React, { useState, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { FileUploader } from "./file-uploader";
import { FileViewer } from "./file-upload-viewer";
import axios from "axios";

type FileUploaderType = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  progress: number;
  file: File;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData?: any;
};

export const FileUploadContainer = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaderType[]>([]);
  const [uploadedFilesToShow, setUploadedFilesToShow] = useState<
    FileUploaderType[]
  >([]);
  const [showUploadViewer, setShowUploadViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null): void => {
    if (!files) return;

    const newFiles: FileUploaderType[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      progress: 0,
      file,
    }));

    setUploadedFiles((prev) => [...newFiles, ...prev]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleUploadFiles = async (filesToUpload?: FileUploaderType[]) => {
    const targetFiles = filesToUpload || uploadedFiles;

    const updatedFiles = uploadedFiles.map((file) =>
      targetFiles.some((f) => f.id === file.id)
        ? { ...file, progress: 50 }
        : file
    );

    setUploadedFiles(updatedFiles);

    const formData = new FormData();

    const firstFile = targetFiles[0];
    if (!firstFile?.file) {
      return;
    }

    formData.append("image", firstFile.file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/process-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          const updatedProgress = updatedFiles.map((file) =>
            targetFiles.some((f) => f.id === file.id)
              ? { ...file, progress: percent }
              : file
          );
          setUploadedFiles(updatedProgress);
        },
      }
    );

    const filesWithResponse = targetFiles.map((file) => ({
      ...file,
      progress: 100,
      responseData: response.data,
    }));

    setUploadedFilesToShow(filesWithResponse);
    setShowUploadViewer(true);
  };

  return (
    <Flex mx="auto" mt={10} p={6} gap={6}>
      <Flex>
        <FileUploader
          uploadedFiles={uploadedFiles}
          handleFiles={handleFiles}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          onDrop={onDrop}
          onBrowseClick={onBrowseClick}
          handleUploadFiles={handleUploadFiles}
        />
      </Flex>
      <Flex>
        {showUploadViewer && <FileViewer uploadedFiles={uploadedFilesToShow} />}
      </Flex>
    </Flex>
  );
};

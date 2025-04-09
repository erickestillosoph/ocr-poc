import React, { useState, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { FileUploader } from "./file-uploader";
import { FileViewer } from "./file-upload-viewer";

type FileUploaderType = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  progress: number;
};

export const FileUploadContainer = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaderType[]>([]);
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

  const handleUploadFiles = (filesToUpload?: FileUploaderType[]) => {
    const targetFiles = filesToUpload || uploadedFiles;
  
    const updatedFiles = uploadedFiles.map((file) =>
      targetFiles.some((f) => f.id === file.id)
        ? { ...file, progress: 100 }
        : file
    );
  
    setUploadedFiles(updatedFiles);
    setShowUploadViewer(true);
  };

  return (
    <Flex mx="auto" mt={10} p={6} gap={6} >
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
          {showUploadViewer && (
            <FileViewer uploadedFiles={uploadedFiles} />
          )}
        </Flex>
    </Flex>
  );
};
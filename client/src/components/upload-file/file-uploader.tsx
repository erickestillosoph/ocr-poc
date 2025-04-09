import React, { useState } from "react";
import {
  Box,
  Button,
  Icon,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Flex,
  Select,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaImage,
  FaEllipsisV,
} from "react-icons/fa";
import { formatBytes, timeAgo } from "../utility/format-bytes";

type FileType = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  progress: number;
};

type Props = {
  uploadedFiles: FileType[];
  handleFiles: (files: FileList | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  handleUploadFiles: (filesToUpload: FileType[]) => void; 
};

export const FileUploader = ({
  uploadedFiles,
  handleFiles,
  fileInputRef,
  onDrop,
  onBrowseClick,
  handleUploadFiles,
}: Props) => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFileName(event.target.value);
  };
  const handleUploadClick = () => {
    if (!selectedFileName) return handleUploadFiles(uploadedFiles); 

    const selectedFile = uploadedFiles.find(
      (file) => file.name === selectedFileName
    );
    if (selectedFile) {
      handleUploadFiles([selectedFile]); 
      return;
    }
  };

  return (
    <Box
      flex="1"
      p="16px"
      bg="gray.50"
      borderColor="gray.500"
      borderRadius="16px"
      boxShadow="lg"
      overflow="auto"
      maxH="800px"
      minH="400px"
      display="flex"
      flexDirection="column"
    >
      <Box flex="1">

        <Box
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="8px"
          bg="white"
          p="16px"
          textAlign="center"
          onClick={onBrowseClick}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          cursor="pointer"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="200px"
        >
          <Icon as={FaCloudUploadAlt} boxSize="24px" color="gray.400" mb={2} />
          <Text color="gray.500">Click to browse or drag and drop files</Text>
          <Input
            type="file"
            ref={fileInputRef}
            display="none"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </Box>

        <Flex justify="flex-end" m={2}>
          <Select
            placeholder="Select a file"
            width="150px"
            onChange={handleSelectChange}
            value={selectedFileName}
          >
            {uploadedFiles.map((file) => (
              <option key={file.id} value={file.name}>
                {file.name}
              </option>
            ))}
          </Select>
        </Flex>

        <VStack align="stretch">
          {uploadedFiles.map((file) => (
            <Box key={file.id}>
              <HStack align="start">
                <Icon
                  as={file.type.includes("image") ? FaImage : FaFileAlt}
                  boxSize="16px"
                  mt={1}
                />
                <Box flex="1">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="sx" noOfLines={1}>
                      {file.name}
                    </Text>
                    <Badge fontSize="10px" colorScheme="gray">
                      {formatBytes(file.size)}
                    </Badge>
                  </Flex>
                  <Text fontSize="xs" color="gray.400" textAlign="left">
                    {timeAgo(new Date(file.uploadedAt))}
                  </Text>
                  <Progress value={file.progress} variant="subtle" />
                </Box>
                <Icon as={FaEllipsisV} boxSize="16px" color="gray.400" mt={1} />
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
      <Box>
        <Button
          mt="8px"
          py="4px"
          px="50px"
          borderRadius="8px"
          bg="pink"
          fontWeight="xs"
          onClick={handleUploadClick}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};

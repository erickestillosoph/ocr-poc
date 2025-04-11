import { Box, Text, VStack } from "@chakra-ui/react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadedFiles: any[];
};

export const FileViewer = ({ uploadedFiles }: Props) => (
  <Box
    flex="1"
    borderRadius="8px"
    boxShadow="lg"
    p={6}
    borderColor="gray.200"
    bg="gray.50"
  >
    <Text fontSize="xl" fontWeight="bold" mb={4}>
      Uploaded Files Viewer
    </Text>
    {uploadedFiles.length === 0 ? (
      <Text color="gray.400">No files uploaded.</Text>
    ) : (
      <VStack align="stretch" gap={4}>
        {uploadedFiles.map((file) => (
          <Box key={file.id} p={4} borderRadius="8px" borderColor="gray.300">
            <Text fontWeight="medium">{file.name}</Text>
            <Text fontSize="sm" color="gray.500" textAlign="left">
              {JSON.stringify(file.responseData)}
            </Text>
          </Box>
        ))}
      </VStack>
    )}
  </Box>
);

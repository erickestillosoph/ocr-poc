import { formatBytes } from "../utility/format-bytes";
import { Box, Text, VStack } from "@chakra-ui/react";

type Props = {
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
      <VStack align="stretch" spacing={4}>
        {uploadedFiles.map((file) => (
          <Box
            key={file.id}
            p={4}
            borderRadius="8px"
            borderColor="gray.300"
          >
            <Text fontWeight="medium">{file.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {formatBytes(file.size)} • {file.type} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione fugiat non facilis modi officia? Possimus, iure. Atque deserunt ab repellendus quisquam, fuga tempore eaque necessitatibus eveniet eius quidem vero. Eius? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus velit doloribus possimus autem voluptas, unde ab harum, ratione nobis repellendus molestias quidem aliquam dolores consequuntur rem minus ipsam commodi? Deleniti.
            </Text>
          </Box>
        ))}
      </VStack>
    )}
  </Box>
);


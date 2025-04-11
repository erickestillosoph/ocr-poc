import { useState } from "react";
import { useAppTheme } from "@/shared/theme";
import { Box, Button, Divider, Input, VStack } from "@chakra-ui/react";
import { FaFilePdf, FaImage } from "react-icons/fa";

import { useImageMutation } from "../hooks/use-image-mutation ";
import { usePdfMutation } from "../hooks/use-pdf-mutation";

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const [showFileInput, setShowFileInput] = useState(false);
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    openImageRef,
  } = useImageMutation();
  const {
    getRootProps: getPDFRootProps,
    getInputProps: getPDFInputProps,
    openPDFRef,
  } = usePdfMutation();

  const handleRegiserFile = () => setShowFileInput(!showFileInput);

  return (
    <>
      <VStack
        display="grid"
        alignContent="space-between"
        height="full"
        w="full"
      >
        <VStack
          alignItems="flex-start"
          spacing="16px"
          position="relative"
          w="full"
          textAlign="center"
        >
          <Button
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            variant="solid"
            w="full"
            zIndex="1"
            mt="12px"
            px="3"
            py="4"
            _hover={{
              color: "blue.500",
              backgroundColor: "transparent",
            }}
            onClick={handleRegiserFile}
          >
            ファイルを登録
          </Button>
          {showFileInput && (
            <VStack
              position="absolute"
              mt="4px"
              height="fit-content"
              backgroundColor={theme.colors.gray[50]}
              borderRadius="md"
              w="200px"
              top="12"
              right="0"
            >
              <Box
                p={6}
                display="none"
                border="2px dashed"
                borderRadius="lg"
                textAlign="center"
                {...getImageRootProps()}
                cursor="pointer"
              >
                <Input display="none" {...getImageInputProps()} size="md" />
              </Box>
              <Box
                p={6}
                display="none"
                border="2px dashed"
                borderRadius="lg"
                textAlign="center"
                {...getPDFRootProps()}
                cursor="pointer"
              >
                <Input display="none" {...getPDFInputProps()} size="md" />
              </Box>
              <Button
                size="xs"
                variant="ghost"
                mt="12px"
                pb="6px"
                w="full"
                justifyContent="space-between"
                borderColor="transparent"
                _hover={{
                  borderColor: "transparent",
                  backgroundColor: "blue.50",
                }}
                onClick={() => openImageRef.current?.()}
              >
                <span style={{ fontSize: "10px" }}>写真ライブラリ</span>
                <FaImage color={theme.colors.blue[500]} size="14px" />
              </Button>
              <Divider color={theme.colors.gray[400]} mt="0px" mb="0px" />
              <Button
                size="xs"
                variant="ghost"
                pt="12px"
                mb="12px"
                w="full"
                borderColor="transparent"
                justifyContent="space-between"
                _hover={{
                  borderColor: "transparent",
                  backgroundColor: "blue.50",
                }}
                onClick={() => openPDFRef.current?.()}
              >
                <span style={{ fontSize: "10px" }}>ファイルを選択</span>
                <FaFilePdf color={theme.colors.blue[500]} size="14px" />
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </>
  );
};

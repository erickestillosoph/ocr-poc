import { useState } from "react";
import { useAppTheme } from "@/shared/theme";
import { Box, Button, Divider, Input, VStack } from "@chakra-ui/react";
import { FaFilePdf, FaImage } from "react-icons/fa";

import { useImageMutation } from "../hooks/use-image-mutation";
import { usePdfMutation } from "../hooks/use-pdf-mutation";
import { CenterSpinner, paths } from "@/shared";
import { useNavigate } from "react-router-dom";

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const [showFileInput, setShowFileInput] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    openImageRef,
    isPending: isImagePending,
  } = useImageMutation();
  const {
    getRootProps: getPDFRootProps,
    getInputProps: getPDFInputProps,
    openPDFRef,
    isPending: isPDFPending,
  } = usePdfMutation();
  const toggleFileInput = () => {
    setShowFileInput(true);
    setIsHidden(true);
  };

  const handleImageUpload = () => {
    openImageRef.current?.();
    setIsHidden(false);
  };

  const handlePDFUpload = () => {
    openPDFRef.current?.();
    setIsHidden(false);
  };

  return (
    <VStack px="16px" >
      <CenterSpinner loading={isImagePending || isPDFPending} />

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
            w="full"
            onClick={() => navigate(paths.cameraAccessUploadFile)}
            _hover={{
            color: "blue.500",
            backgroundColor: "transparent",
          }}
          gap="8px"
        >
          写真を撮影
        </Button>
          <Button
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            variant="solid"
            w="full"
          zIndex="1"
          _hover={{
            color: "blue.500",
            backgroundColor: "transparent",
          }}
          onClick={() => toggleFileInput()}
        >
            ファイルを登録
          </Button>
        {showFileInput && (
          <VStack
            position="absolute"
            mt="45px"
            height="fit-content"
            backgroundColor={theme.colors.white}
            w="200px"
            top="14"
            right="0"
            display={isHidden ? "flex" : "none"}
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
              onClick={handleImageUpload}
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
              onClick={handlePDFUpload}
            >
              <span style={{ fontSize: "10px" }}>ファイルを選択</span>
              <FaFilePdf color={theme.colors.blue[500]} size="14px" />
            </Button>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

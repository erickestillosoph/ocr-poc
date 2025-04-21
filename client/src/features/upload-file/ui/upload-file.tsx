import { useState } from "react";
import { useAppTheme } from "@/shared/theme";
import { Box, Button, Divider, Input, VStack } from "@chakra-ui/react";
import { FaFilePdf, FaImage } from "react-icons/fa";

import { useImageMutation } from "../hooks/use-image-mutation";
import { usePdfMutation } from "../hooks/use-pdf-mutation";
import { CenterSpinner } from "@/shared";

export const UploadFile = () => {
  const { theme } = useAppTheme();
  const [showFileInput, setShowFileInput] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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

  // useEffect(() => {
  //   if (!isImagePending && imageResults) {
  //     setLocalStorage("imageResults", imageResults);
  //   }
  //   if (!isPDFPending && pdfResults) {
  //     setLocalStorage("pdfResults", pdfResults);
  //   }
  // }, [
  //   imageResults,
  //   pdfResults,
  //   isImageSuccess,
  //   isPDFSuccess,
  //   isImageError,
  //   isPDFError,
  //   isImagePending,
  //   isPDFPending,
  // ]);

  return (
    <>
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
            onClick={() => toggleFileInput()}
          >
            ファイルを登録
          </Button>
          {showFileInput && (
            <VStack
              position="absolute"
              mt="4px"
              height="fit-content"
              backgroundColor={theme.colors.white}
              boxShadow="lg"
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
                onClick={handleImageUpload}
              >
               写真ライブラリ
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
               ファイルを選択
                <FaFilePdf color={theme.colors.blue[500]} size="14px" />
              </Button>
            </VStack>
        )}
      </VStack>
    </>
  );
};

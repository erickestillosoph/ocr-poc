import { useState } from "react";
import { useAppTheme } from "@/shared/theme";
import { Button, Divider, VStack } from "@chakra-ui/react";
import { FaFilePdf, FaImage } from "react-icons/fa";
export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const [showFileInput, setShowFileInput] = useState(false);

  const handleRegiserFile = () => setShowFileInput(!showFileInput);

  return (
    <form style={{ height: "100%", marginTop: "20px" }}>
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
                onClick={() => setShowFileInput(false)}
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
                onClick={() => setShowFileInput(false)}
              >
                <span style={{ fontSize: "10px" }}>ファイルを選択</span>
                <FaFilePdf color={theme.colors.blue[500]} size="14px" />
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </form>
  );
};

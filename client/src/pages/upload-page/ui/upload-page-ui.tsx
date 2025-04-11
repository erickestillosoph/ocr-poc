import { useState } from "react";
import { useAppTheme } from "@/shared/theme";
import { Button, VStack } from "@chakra-ui/react";

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const [showFileInput, setShowFileInput] = useState(false);

  const handleRegiserFile = () => setShowFileInput(!showFileInput);

  return (
    <form style={{ height: "100%", marginTop: "20px" }}>
      <VStack display="grid" alignContent="space-between" height="full">
        <VStack alignItems="flex-start" spacing="16px">
          <Button
            color={theme.colors.white}
            backgroundColor={theme.colors.blue}
            w="full"
            position="relative"
            zIndex="1"
            px="3"
            py="4"
            onClick={handleRegiserFile}
          >
            <span>ファイルを登録</span>
          </Button>
          {showFileInput && (
            <VStack mt="16px" w="fit-content" height="fit-content">
              <Button size="sm" variant="outline">
                写真ライブラリ
              </Button>
              <Button size="sm" variant="outline">
                ファイルを選択
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </form>
  );
};

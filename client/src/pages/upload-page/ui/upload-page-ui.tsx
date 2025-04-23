import { useRef } from "react";
import { useAppTheme } from "@/shared/theme";
import { Button, Input, Box } from "@chakra-ui/react";
import { useImageMutation } from "../hooks/use-image-mutation";
import { usePdfMutation } from "../hooks/use-pdf-mutation";
import { CenterSpinner } from "@/shared";

//TODO: add a timer to the upload page

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: uploadImage, isPending: isImagePending } = useImageMutation();
  const { mutate: uploadPDF, isPending: isPDFPending } = usePdfMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (isPDF) {
      uploadPDF([file]);
    } else {
      uploadImage(file);
    }

    event.target.value = "";
  };

  return (
    <Box
      alignContent="space-between"
      w="full"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px="16px"

    >
      <CenterSpinner loading={isImagePending || isPDFPending} />

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        display="none"
        onChange={handleFileChange}
      />

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
        onClick={handleUploadClick}
      >
        ファイルを登録
      </Button>
    </Box>
  );
};

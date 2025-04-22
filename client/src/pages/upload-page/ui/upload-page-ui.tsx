import { useRef } from "react";
import { useAppTheme } from "@/shared/theme";
import { Button, Input, VStack } from "@chakra-ui/react";
import { useImageMutation } from "../hooks/use-image-mutation";
import { usePdfMutation } from "../hooks/use-pdf-mutation";
import { CenterSpinner, paths } from "@/shared";
import { useNavigate } from "react-router-dom";

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
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
    <VStack p="16px" spacing="16px">
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
        w="full"
        onClick={() => navigate(paths.cameraAccessUploadFile)}
        _hover={{
        color: "blue.500",
        backgroundColor: "transparent", }}
        >
        写真を撮影
      </Button>
      <Button
        color={theme.colors.white}
        backgroundColor={theme.colors.blue}
        w="full"
        _hover={{
          color: "blue.500",
          backgroundColor: "transparent",
        }}
        onClick={handleUploadClick}
      >
        ファイルを登録
      </Button>
    </VStack>
  );
};

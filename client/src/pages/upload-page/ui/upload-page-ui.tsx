import { useRef } from "react";
import { useAppTheme } from "@/shared/theme";
import { Button, Input, Box } from "@chakra-ui/react";
import { usePdfMutation } from "../hooks/use-pdf-mutation";
import { CenterSpinner } from "@/shared";
import { useCameraCaptureMutation } from "../hooks/use-capture-image-mutation";

export const UploadPagePage = () => {
  const { theme } = useAppTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: uploadPDF, isPending: isPDFPending } = usePdfMutation();
  const { isPending: isCameraCapturePending, onDrop } =
    useCameraCaptureMutation();
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // const isLikelyNewCameraPhoto = (file: File): boolean => {
  //   const now = Date.now();
  //   const fileTime = file.lastModified;
  //   return now - fileTime < 30 * 1000;
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (isPDF) {
      uploadPDF([file]);
    } else {
      onDrop([file]);
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
      <CenterSpinner loading={isPDFPending || isCameraCapturePending} />

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        display="none"
        onChange={handleFileChange}
      />
      {/* <Input
        display="none"
        {...getInputProps({
          id: "image",
          name: "image",
          capture: "environment",
          type: "file",
          accept: "image/*",
          multiple: false,
        })}
        size="md"
      /> */}

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

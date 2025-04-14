import { useAppTheme } from "@/shared/theme";
import { Code, VStack, Text, Box, Spacer } from "@chakra-ui/react";
import { getLocalStorage } from "@/shared";

export const ViewResultsPageUI = () => {
  const { theme } = useAppTheme();
  const imageResults = getLocalStorage("imageResults");
  const pdfResults = getLocalStorage("pdfResults");
  const cameraImageResults = getLocalStorage("cameraImageResults");

  const imageResultsArray = JSON.stringify(imageResults, null, 1);
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);
  const cameraImageResultsArray = JSON.stringify(cameraImageResults, null, 1);

  const titleCaption = (title: string, json: string) => {
    return (
      <VStack>
        <Text
          fontSize="lg"
          display="flex"
          color={theme.colors.blue}
          textAlign="left"
          textTransform="uppercase"
          fontWeight="bold"
          w="full"
        >
          <Text
            p="12px 20px"
            borderRadius="10px"
            backgroundColor={theme.colors.gray[200]}
          >
            {title}
          </Text>
        </Text>
        <Box
          backgroundColor={theme.colors.gray[100]}
          borderRadius="10px"
          p="20px 20px"
        >
          <Code
            fontSize="sm"
            w="full"
            textAlign="left"
            appearance="menulist"
            variant="subtle"
            overflow="auto"
            maxH="50vh"
            backgroundColor="transparent"
          >
            {json}
          </Code>
        </Box>
      </VStack>
    );
  };
  return (
    <VStack
      mt="20px"
      width="100%"
      display="flex"
      flexDirection="column"
      gap="20px"
      alignContent="space-between"
      height="full"
      w="full"
      mb="120px"
    >
      <Spacer padding="30px" />
      {imageResults && titleCaption("Image Results", imageResultsArray)}
      {pdfResults && titleCaption("Pdf Results", pdfResultsArray)}
      {cameraImageResults &&
        titleCaption("Camera Image Results", cameraImageResultsArray)}
      <Spacer padding="30px" />
    </VStack>
  );
};

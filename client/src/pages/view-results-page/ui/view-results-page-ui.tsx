import { useAppTheme } from "@/shared/theme";
import { Code, VStack, Text, Box, Spacer } from "@chakra-ui/react";
import { getLocalStorage } from "@/shared";
import { useMemo } from "react";

export const ViewResultsPageUI = () => {
  const { theme } = useAppTheme();
  const imageResults = getLocalStorage("imageResults");
  const pdfResults = getLocalStorage("pdfResults");
  const cameraImageResults = getLocalStorage("cameraImageResults");

  const imageResultsArray = JSON.stringify(imageResults, null, 1);
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);
  const cameraImageResultsArray = JSON.stringify(cameraImageResults, null, 1);

  // Combine all results with their timestamps
  const allResults = useMemo(() => {
    const results = [];
    if (imageResults) {
      results.push({
        title: "Image Results",
        data: imageResultsArray,
        timestamp: getLocalStorage("imageResultsTimestamp") || Date.now(),
      });
    }
    if (pdfResults) {
      results.push({
        title: "PDF Results",
        data: pdfResultsArray,
        timestamp: getLocalStorage("pdfResultsTimestamp") || Date.now(),
      });
    }
    if (cameraImageResults) {
      results.push({
        title: "Camera Image Results",
        data: cameraImageResultsArray,
        timestamp: getLocalStorage("cameraImageResultsTimestamp") || Date.now(),
      });
    }

    return results.sort((a, b) => b.timestamp - a.timestamp);
  }, [
    imageResults,
    pdfResults,
    cameraImageResults,
    imageResultsArray,
    pdfResultsArray,
    cameraImageResultsArray,
  ]);

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
      {allResults.map((result) => titleCaption(result.title, result.data))}
      <Spacer padding="30px" />
    </VStack>
  );
};

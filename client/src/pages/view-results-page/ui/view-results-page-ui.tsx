import { useAppTheme } from "@/shared/theme";
import { VStack, Text, Box, Spacer } from "@chakra-ui/react";
import { getLocalStorage } from "@/shared";
import { useMemo } from "react";
import { FormatOptions, prettyPrintJson } from "pretty-print-json";

export const ViewResultsPageUI = () => {
  const { theme } = useAppTheme();
  const imageResults = getLocalStorage("imageResults");
  const pdfResults = getLocalStorage("pdfResults");
  const cameraImageResults = getLocalStorage("cameraImageResults");

  const imageResultsArray = JSON.stringify(imageResults, null, 1);
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);
  const cameraImageResultsArray = JSON.stringify(cameraImageResults, null, 1);
  const innerWidth = window.innerWidth;
  const isDesktop = window.innerWidth > 1024;
  const allResults = useMemo(() => {
    const results = [];
    if (imageResults) {
      results.push({
        title: "読み取り結果",
        data: imageResultsArray,
        timestamp:
          getLocalStorage("imageResultsTimestamp") || new Date().getTime(),
      });
    }
    if (pdfResults) {
      results.push({
        title: "読み取り結果",
        data: pdfResultsArray,
        timestamp:
          getLocalStorage("pdfResultsTimestamp") || new Date().getTime(),
      });
    }
    if (cameraImageResults) {
      results.push({
        title: "読み取り結果",
        data: cameraImageResultsArray,
        timestamp:
          getLocalStorage("cameraImageResultsTimestamp") ||
          new Date().getTime(),
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

  const titleCaption = (title: string, json: string, index: number) => {
    const options: FormatOptions = {
      indent: 6,
      linksNewTab: true,
      quoteKeys: true,
      trailingCommas: true,
      lineNumbers: true,
      linkUrls: true,
    };

    const prettyJson = prettyPrintJson.toHtml(JSON.parse(json), options);

    const isCurrent = index === 0;
    return (
      <Box
        key={title}
        width="100%"
        gap="20px"
        display="flex"
        flexDirection="column"
      >
        <Box
          fontSize="lg"
          display="flex"
          color={theme.colors.blue}
          textAlign="left"
          textTransform="uppercase"
          fontWeight="bold"
          justifyContent="space-between"
          w="full"
        >
          <Text
            p="12px 20px"
            borderRadius="10px"
            fontSize="10px"
            backgroundColor={theme.colors.gray[200]}
          >
            {title}
          </Text>
          <Text
            height="fit-content"
            p="8px"
            borderRadius="10px"
            border="1px solid"
            borderColor={
              isCurrent ? theme.colors.green[500] : theme.colors.red[500]
            }
            backgroundColor={
              isCurrent ? theme.colors.green[50] : theme.colors.red[50]
            }
            fontSize="10px"
            color={isCurrent ? theme.colors.green[500] : theme.colors.red[500]}
          >
            {isCurrent ? "現在" : "以前の"}
          </Text>
        </Box>
        <Box
          backgroundColor={theme.colors.gray[900]}
          borderRadius="10px"
          p="20px 20px"
          border="1px solid"
          width={isDesktop ? "100%" : innerWidth - 30}
          borderColor={isCurrent ? theme.colors.green[300] : "transparent"}
          style={{ overflow: "auto" }}
        >
          <Box
            pl="30px"
            textAlign="left"
            width={isDesktop ? "100%" : "800px"}
            height="100%"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{ __html: prettyJson }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <VStack height="100vh" width="100%" gap="20px" alignContent="space-between">
      <Spacer padding="10px" />
      {allResults.map((result, index) =>
        titleCaption(result.title, result.data, index)
      )}
      <Spacer padding="60px" />
    </VStack>
  );
};

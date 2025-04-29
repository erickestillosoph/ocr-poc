import { useAppTheme } from "@/shared/theme";
import { VStack, Text, Box, Spacer, Button } from "@chakra-ui/react";
import { getLocalStorage } from "@/shared";
import { useMemo } from "react";
import { FormatOptions, prettyPrintJson } from "pretty-print-json";
import { useSearchParams } from "react-router-dom";

export const ViewResultsPageUI = () => {
  const { theme } = useAppTheme();
  const imageResults = getLocalStorage("imageResults");
  const pdfResults = getLocalStorage("pdfResults");
  const cameraImageResults = getLocalStorage("cameraImageResults");
  const pdfResultsDify = getLocalStorage("pdfResultsDify");
  const imageResultsDify = getLocalStorage("imageResultsDify");
  const cameraImageResultsDify = getLocalStorage("cameraImageResultsDify");

  const imageResultsArray = JSON.stringify(imageResults, null, 1);
  const imageResultsArrayDify = imageResultsDify?.outputs.response;
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);
  const pdfResultsArrayDify = pdfResultsDify?.outputs.response;
  const cameraImageResultsArray = JSON.stringify(cameraImageResults, null, 1);
  const cameraImageResultsArrayDify = cameraImageResultsDify?.outputs.response;
  const copyImageResults = () =>
    navigator.clipboard.writeText(imageResultsArray);
  const copyPdfResults = () => navigator.clipboard.writeText(pdfResultsArray);
  const copyCameraImageResults = () =>
    navigator.clipboard.writeText(cameraImageResultsArray);
  const copyPdfResultsDify = () =>
    navigator.clipboard.writeText(pdfResultsArrayDify);
  const copyCameraImageResultsDify = () =>
    navigator.clipboard.writeText(cameraImageResultsArrayDify);
  const copyImageResultsDify = () =>
    navigator.clipboard.writeText(imageResultsArrayDify);

  const innerWidth = window.innerWidth;
  const isDesktop = window.innerWidth > 1024;
  const [searchParams] = useSearchParams();
  const isClipboard = searchParams.get("clipboard") === "true";

  const allResults = useMemo(() => {
    const results = [];
    if (imageResults) {
      results.push({
        title: "「画像の結果」",
        data: imageResultsArray,
        isDify: getLocalStorage("imageResultsTimestamp") ? false : true,
        timestamp:
          getLocalStorage("imageResultsTimestamp") || new Date().getTime(),
      });
    }
    if (pdfResults) {
      results.push({
        title: "読み取り結果",
        data: pdfResultsArray,
        isDify: getLocalStorage("pdfResultsTimestamp") ? false : true,
        timestamp:
          getLocalStorage("pdfResultsTimestamp") || new Date().getTime(),
      });
    }
    if (pdfResultsDify) {
      results.push({
        title: "読み取り結果 Dify",
        data: pdfResultsArrayDify,
        isDify: getLocalStorage("pdfResultsTimestampDify") ? true : false,
        timestamp:
          getLocalStorage("pdfResultsTimestampDify") || new Date().getTime(),
      });
    }
    if (cameraImageResults) {
      results.push({
        title: "「カメラ画像の結果」",
        data: cameraImageResultsArray,
        isDify: getLocalStorage("cameraImageResultsTimestamp") ? false : true,
        timestamp:
          getLocalStorage("cameraImageResultsTimestamp") ||
          new Date().getTime(),
      });
    }
    if (cameraImageResultsDify) {
      results.push({
        title: "「カメラ画像の結果」 Dify",
        data: cameraImageResultsArrayDify,
        isDify: getLocalStorage("cameraImageResultsTimestampDify")
          ? true
          : false,
        timestamp:
          getLocalStorage("cameraImageResultsTimestampDify") ||
          new Date().getTime(),
      });
    }
    if (imageResultsDify) {
      results.push({
        title: "「画像の結果」 Dify",
        data: imageResultsArrayDify,
        isDify: getLocalStorage("imageResultsTimestampDify") ? true : false,
        timestamp:
          getLocalStorage("imageResultsTimestampDify") || new Date().getTime(),
      });
    }

    return results.sort((a, b) => b.timestamp - a.timestamp);
  }, [
    imageResultsDify,
    cameraImageResultsDify,
    imageResultsArrayDify,
    cameraImageResultsArrayDify,
    imageResults,
    pdfResults,
    cameraImageResults,
    imageResultsArray,
    pdfResultsArray,
    cameraImageResultsArray,
    pdfResultsArrayDify,
    pdfResultsDify,
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

    const parsedJsonResults = (data: string) => {
      const jsonString = data.replace(/```json|```/g, "").trim();
      const jsonObject = JSON.parse(jsonString);

      return prettyPrintJson.toHtml(jsonObject, options);
    };

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
          {title === "「画像の結果」" && isClipboard && (
            <Button onClick={copyImageResults}>コピー image</Button>
          )}
          {title === "読み取り結果" && isClipboard && (
            <Button onClick={copyPdfResults}>コピー pdf</Button>
          )}
          {title === "「カメラ画像の結果」" && isClipboard && (
            <Button onClick={copyCameraImageResults}>コピー camera</Button>
          )}
          {title === "読み取り結果 Dify" && isClipboard && (
            <Button onClick={copyPdfResultsDify}>コピー pdf</Button>
          )}
          {title === "「画像の結果」 Dify" && isClipboard && (
            <Button onClick={copyImageResultsDify}>コピー image</Button>
          )}
          {title === "「カメラ画像の結果」 Dify" && isClipboard && (
            <Button onClick={copyCameraImageResultsDify}>コピー camera</Button>
          )}

          <Box
            pl="30px"
            textAlign="left"
            width={isDesktop ? "100%" : "800px"}
            height="100%"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{
              __html: parsedJsonResults(json),
            }}
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

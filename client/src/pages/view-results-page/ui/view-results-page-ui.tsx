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
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);
  const cameraImageResultsArray = JSON.stringify(cameraImageResults, null, 1);

  const imageResultsArrayDify = imageResultsDify?.outputs.response;
  const pdfResultsArrayDify = pdfResultsDify?.outputs.response;

  const cameraImageResultsArrayDify = cameraImageResultsDify?.outputs.response;

  const copyImageResults = () =>
    navigator.clipboard.writeText(imageResultsArray);
  const copyPdfResults = () => navigator.clipboard.writeText(pdfResultsArray);
  const copyCameraImageResults = () =>
    navigator.clipboard.writeText(cameraImageResultsArray);
  const copyPdfResultsDify = () =>
    navigator.clipboard.writeText(pdfResultsArrayDify);
  const copyImageResultsDify = () =>
    navigator.clipboard.writeText(imageResultsArrayDify);

  const copyCameraImageResultsDify = () =>
    navigator.clipboard.writeText(cameraImageResultsArrayDify);

  const innerWidth = window.innerWidth;
  const isDesktop = window.innerWidth > 1024;
  const [searchParams] = useSearchParams();
  const isClipboard = searchParams.get("clipboard") === "true";

  const allResults = useMemo(() => {
    const results = [];
    if (imageResults) {
      results.push({
        key: "imageResults",
        title: "「画像の結果」",
        data: imageResultsArray,
        isDify: false,
        timestamp:
          getLocalStorage("imageResultsTimestamp") || new Date().getTime(),
      });
    }
    if (pdfResults) {
      results.push({
        key: "pdfResults",
        title: "「読み取り結果」",
        data: pdfResultsArray,
        isDify: false,
        timestamp:
          getLocalStorage("pdfResultsTimestamp") || new Date().getTime(),
      });
    }

    if (cameraImageResults) {
      results.push({
        key: "cameraImageResults",
        title: "「カメラ画像の結果」",
        data: cameraImageResultsArray,
        isDify: false,
        timestamp:
          getLocalStorage("cameraImageResultsTimestamp") ||
          new Date().getTime(),
      });
    }

    if (imageResultsDify) {
      results.push({
        key: "imageResultsDify",
        title: "「画像の結果」 Dify",
        data: imageResultsArrayDify,
        isDify: true,
        timestamp:
          getLocalStorage("imageResultsTimestampDify") || new Date().getTime(),
      });
    }

    if (cameraImageResultsDify) {
      results.push({
        key: "cameraImageResultsDify",
        title: "「カメラ画像の結果」 Dify",
        data: cameraImageResultsArrayDify,
        isDify: true,
        timeStamp:
          getLocalStorage("cameraImageResultsTimestampDify") ||
          new Date().getTime(),
      });
    }
    if (pdfResultsDify) {
      results.push({
        key: "pdfResultsDify",
        title: "「読み取り結果」 Dify",
        data: pdfResultsArrayDify,
        isDify: true,
        timestamp:
          getLocalStorage("pdfResultsTimestampDify") || new Date().getTime(),
      });
    }
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }, [
    imageResultsDify,
    imageResultsArrayDify,
    imageResults,
    pdfResults,
    cameraImageResults,
    imageResultsArray,
    pdfResultsArray,
    cameraImageResultsArray,
    pdfResultsArrayDify,
    pdfResultsDify,
    cameraImageResultsDify,
    cameraImageResultsArrayDify,
  ]);

  const titleCaption = (
    key: string,
    title: string,
    json: string,
    isDify: boolean,
    index: number
  ) => {
    const options: FormatOptions = {
      indent: 6,
      linksNewTab: true,
      quoteKeys: true,
      trailingCommas: true,
      lineNumbers: true,
      linkUrls: true,
    };
    // const jsonString = json.replace(/```json|```/g, "").trim();
    // const jsonObject = JSON.parse(jsonString);
    // const parsedJsonResults = prettyPrintJson.toHtml(jsonObject, options);
    const parsedJsonResults = () => {
      if (isDify) {
        console.log(isDify, title, key);
        const jsonString = json.replace(/```json|```/g, "");
        const jsonObject = JSON.parse(jsonString);
        return prettyPrintJson.toHtml(jsonObject, options);
      } else {
        console.log(isDify, title, key);
        const jsonParsed = JSON.parse(json);
        return prettyPrintJson.toHtml(jsonParsed, options);
      }
    };

    const isCurrent = index === 0;
    return (
      <Box
        key={key}
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
          {key === "imageResults" && isClipboard && (
            <Button onClick={copyImageResults}>コピー image</Button>
          )}
          {key === "pdfResults" && isClipboard && (
            <Button onClick={copyPdfResults}>コピー pdf</Button>
          )}
          {key === "cameraImageResults" && isClipboard && (
            <Button onClick={copyCameraImageResults}>コピー camera</Button>
          )}
          {key === "pdfResultsDify" && isClipboard && (
            <Button onClick={copyPdfResultsDify}>コピー pdf</Button>
          )}
          {key === "imageResultsDify" && isClipboard && (
            <Button onClick={copyImageResultsDify}>コピー image</Button>
          )}
          {key === "cameraImageResultsDify" && isClipboard && (
            <Button onClick={copyCameraImageResultsDify}>コピー camera</Button>
          )}
          <Box
            pl="30px"
            textAlign="left"
            width={isDesktop ? "100%" : "800px"}
            height="100%"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{
              __html: parsedJsonResults(),
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
        titleCaption(
          result.key,
          result.title,
          result.data,
          result.isDify,
          index
        )
      )}
      <Spacer padding="60px" />
    </VStack>
  );
};

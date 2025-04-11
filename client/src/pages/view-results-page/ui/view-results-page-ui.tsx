import { useAppTheme } from "@/shared/theme";
import {
  Code,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { getLocalStorage } from "@/shared";

export const ViewResultsPageUI = () => {
  const { theme } = useAppTheme();
  const imageResults = getLocalStorage("imageResults");
  const pdfResults = getLocalStorage("pdfResults");

  const imageResultsArray = JSON.stringify(imageResults, null, 1);
  const pdfResultsArray = JSON.stringify(pdfResults, null, 1);

  return (
    <VStack
      mt="20px"
      width="100%"
      display="grid"
      alignContent="space-between"
      height="full"
      w="full"
    >
      <Tabs
        variant="soft-rounded"
        size="sm"
        w="full"
        colorScheme={theme.colors.blue[100]}
      >
        <TabList gap={2}>
          <Tab>Image</Tab>
          <Tab>Pdf</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Code
              backgroundColor={theme.colors.gray[50]}
              fontSize="sm"
              w="full"
              textAlign="left"
              appearance="auto"
              variant="subtle"
              overflow="auto"
              maxH="50vh"
            >
              {imageResultsArray}
            </Code>
          </TabPanel>

          <TabPanel>
            <Code
              backgroundColor={theme.colors.gray[50]}
              fontSize="sm"
              w="full"
              textAlign="left"
              appearance="auto"
              variant="subtle"
              overflow="auto"
              maxH="50vh"
            >
              {pdfResultsArray}
            </Code>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

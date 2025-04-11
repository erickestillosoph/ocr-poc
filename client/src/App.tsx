import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { AppProvider, AppRoute, JotaiProvider } from "./providers";
import { MainLayoutContainer } from "./layout";

function App() {
  return (
    <>
      <AppProvider>
        <JotaiProvider>
          <ChakraProvider>
            <MainLayoutContainer>
              <AppRoute />
            </MainLayoutContainer>
          </ChakraProvider>
        </JotaiProvider>
      </AppProvider>
    </>
  );
}

export default App;

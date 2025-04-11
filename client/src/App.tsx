import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { AppProvider, AppRoute, JotaiProvider } from "./providers";

function App() {
  return (
    <>
      <AppProvider>
        <JotaiProvider>
          <ChakraProvider>
            <AppRoute />
          </ChakraProvider>
        </JotaiProvider>
      </AppProvider>
    </>
  );
}

export default App;

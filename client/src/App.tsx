import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { AppProvider, AppRoute, JotaiProvider } from "./providers";
import { MainLayoutContainer } from "./layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <JotaiProvider>
          <ChakraProvider>
            <MainLayoutContainer>
              <AppRoute />
            </MainLayoutContainer>
          </ChakraProvider>
        </JotaiProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

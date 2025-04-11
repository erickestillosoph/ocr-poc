import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { AppProvider, AppRoute, JotaiProvider } from "./providers";
import { MainLayoutContainer } from "./layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

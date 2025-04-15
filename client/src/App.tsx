import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { AppProvider, AppRoute, JotaiProvider } from "./providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainLayout } from "./layout";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <JotaiProvider>
          <ChakraProvider>
            <MainLayout>
              <AppRoute />
            </MainLayout>
          </ChakraProvider>
        </JotaiProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

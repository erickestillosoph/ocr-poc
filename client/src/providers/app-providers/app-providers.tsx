import { CenterSpinner } from "@/shared";
import { Button, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router-dom";

const ErrorFallback = () => {
  return (
    <VStack
      w="100%"
      justifyContent="center"
      alignItems="center"
      color="primary.500"
      fontSize="2xl"
      fontWeight="700"
      h="100vh"
    >
      <Text>エラーが発生しました</Text>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        <span>ホーム</span>
      </Button>
    </VStack>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense fallback={<CenterSpinner loading={true} />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>{children}</Router>
      </ErrorBoundary>
    </React.Suspense>
  );
};

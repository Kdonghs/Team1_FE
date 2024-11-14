import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { queryClient } from "./api/instance";
import App from "./App";

const theme = extendTheme({
  fonts: {
    heading:
      '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    body: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

async function deferRender() {
  if (process.env.REACT_APP_RUN_MSW === "true") {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }

  return;
}

deferRender().then(() => {
  root.render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </QueryClientProvider>
  );
});

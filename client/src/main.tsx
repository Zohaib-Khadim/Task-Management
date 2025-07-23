import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "../src/store/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-redux";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);

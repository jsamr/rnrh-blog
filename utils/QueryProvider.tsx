import React, { PropsWithChildren } from "react";
import { LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";

// Long stale timeouts won't impact react-query,
// so just ignore it, see
// https://github.com/tannerlinsley/react-query/issues/1259
LogBox.ignoreLogs(['Setting a timer']);

const queryClient = new QueryClient();

export default function QueryProvider({ children }: PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

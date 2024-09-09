import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloclient';
import '../styles/global.scss';
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { NextWebVitalsMetric } from "next/app";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric);
}

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    process.env.NODE_ENV === "development" ? [chain.hardhat] : [chain.goerli],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );
  const { connectors } = getDefaultWallets({
    appName: "RillaFi",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  const router = useRouter();
  const showNav = router.pathname === "/login" ? false : true;

  return (
    // <SnackbarProvider>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "#41EAD4",
            accentColorForeground: "#292C4F",
            overlayBlur: "small",
          })}
        >
          <div className="globalContainer">
            <Head>
              <title>
                {process.env.NODE_ENV == "development"
                  ? "localhost"
                  : "RillaFi"}
              </title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <meta
                name="description"
                content="Welcome to the RillaFi testnet! Thanks for helping us build the next
              generation of web3 philanthropic tools. This testnet helps us gather
              data to optimize RillaFi and gather potential users. We have a few
              tasks for you to complete while you are here. See below!"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            {showNav && <Navbar />}
            <Component {...pageProps} />
            {/* {showNav && <Footer />} */}
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default MyApp;

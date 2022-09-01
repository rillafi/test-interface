import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { NextWebVitalsMetric } from "next/app";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
// import SnackbarProvider from "react-simple-snackbar";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [chain.goerli],
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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: "#7dcccd",
          accentColorForeground: "#ffffff",
          overlayBlur: "small",
        })}
      >
        <div className="globalContainer">
          <Head>
            <title>
              {process.env.NODE_ENV == "development" ? "localhost" : "RillaFi"}
            </title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {showNav && <Navbar />}
          <Component {...pageProps} />
          {/* {showNav && <Footer />} */}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
    // </SnackbarProvider>
  );
}

export default MyApp;

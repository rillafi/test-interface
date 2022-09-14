import { RainbowKitProvider, Theme, darkTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

// documentation at https://www.rainbowkit.com/docs/custom-theme

const myTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#07296d",
  },
} as Theme);

export const rainbowTheme: Theme = {
  blurs: {
    modalOverlay: "10px",
  },
  colors: {
    accentColor: "#41EAD4",
    accentColorForeground: "#292C4F",
    actionButtonBorder: "#41EAD4",
    actionButtonBorderMobile: "#D0C9E4",
    actionButtonSecondaryBackground: "#41EAD4",
    closeButton: "#41EAD4",
    closeButtonBackground: "...",
    connectButtonBackground: "#3F4478",
    connectButtonBackgroundError: "...",
    connectButtonInnerBackground: "#8E7DBE",
    connectButtonText: "#FFFFFF",
    connectButtonTextError: "...",
    connectionIndicator: "...",
    error: "...",
    generalBorder: "#292C4F",
    generalBorderDim: "...",
    menuItemBackground: "...",
    modalBackdrop: "...",
    modalBackground: "#3F4478",
    modalBorder: "#292C4F",
    modalText: "#FFFFFF",
    modalTextDim: "#8E7DBE",
    modalTextSecondary: "#D0C9E4",
    profileAction: "...",
    profileActionHover: "...",
    profileForeground: "...",
    selectedOptionBorder: "#8E7DBE",
    standby: "...",
  },
  fonts: {
    body: "'Rubik'",
  },
  radii: {
    actionButton: "50px",
    connectButton: "50px",
    menuButton: "50px",
    modal: "20px",
    modalMobile: "20px",
  },
  shadows: {
    connectButton: "...",
    dialog: "...",
    profileDetailsAction: "...",
    selectedOption: "...",
    selectedWallet: "...",
    walletLogo: "...",
  },
};

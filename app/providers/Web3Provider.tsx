"use client";

import {
  Web3ReactHooks,
  Web3ReactProvider,
  initializeConnector,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

const [metaMask, useMetaMask] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, useMetaMask]];

function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
  );
}

export default Web3Provider;

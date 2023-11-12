"use client";

import { Box, Heading } from "@chakra-ui/react";
import { useConnectWallet } from "./ConnectWalletHooks";
import NavBar from "./NavBar";

export default function Home() {
  const { account } = useConnectWallet();

  return (
    <Box textAlign="center" py={8} width="80%">
      <NavBar account={account} />

      <Heading as="h6" size="lg" mt={10}>
        NextJS Hardhat Template
      </Heading>
    </Box>
  );
}

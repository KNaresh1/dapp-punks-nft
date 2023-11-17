"use client";

import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useConnectWallet } from "../hooks";

const NavBar = () => {
  const { account, loading: isConnecting, connectWallet } = useConnectWallet();

  return (
    <Flex align="center" gap="2">
      <Image src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
      <Text fontSize="lg">DApp Template</Text>
      <Spacer />
      {account ? (
        <Text fontSize="md">
          {account.substring(0, 6)}...${account.substring(account.length - 4)}
        </Text>
      ) : (
        <Button
          colorScheme="blue"
          isLoading={isConnecting}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;

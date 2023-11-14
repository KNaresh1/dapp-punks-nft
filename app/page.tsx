"use client";

import { Box, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import Countdown from "react-countdown";
import preview from "../public/preview.png";
import { Mint, MintData, NavBar } from "./components";
import { useConnectWallet, useLoadContract } from "./hooks";

export default function Home() {
  const [isLoading, setLoading] = useState(true);

  const { account, isConnected } = useConnectWallet();
  const { nft, revealTime, maxSupply, totalSupply, cost, balance } =
    useLoadContract();

  return (
    <Box textAlign="center" py={8} width="80%">
      <NavBar account={account} />

      <Heading as="h6" size="lg" m={16}>
        DApp Punks
      </Heading>

      {!isConnected && (
        <Spinner
          thickness="5px"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      {isConnected && (
        <SimpleGrid
          columns={2}
          mt={16}
          alignItems="center"
          justifyItems="center"
        >
          <Box>
            {balance > 0 ? (
              <Image
                src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${balance.toString()}.png`}
                alt="Open Punk"
                width={400}
                height={400}
              />
            ) : (
              <Image
                src={preview}
                alt="Punks"
                width={400}
                height={400}
                priority={true}
              />
            )}
          </Box>
          <Box>
            {revealTime && (
              <Heading size="xl" mb={5}>
                <Countdown date={Number(revealTime)} />
              </Heading>
            )}
            <MintData
              maxSupply={maxSupply}
              totalSupply={totalSupply}
              cost={cost}
              balance={balance}
            />
            <Mint cost={cost} nft={nft} />
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
}

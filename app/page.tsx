"use client";

import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";
import Countdown from "react-countdown";
import preview from "../public/preview.png";
import { Mint, MintData, NavBar } from "./components";
import useLoadContract from "./hooks";

export default function Home() {
  const { nft, revealTime, maxSupply, totalSupply, cost, balance } =
    useLoadContract();

  return (
    <Box textAlign="center">
      <NavBar />

      <Heading as="h6" size="lg" m={8}>
        DApp Punks
      </Heading>

      {nft && (
        <SimpleGrid
          columns={2}
          mt={8}
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
                priority={true}
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

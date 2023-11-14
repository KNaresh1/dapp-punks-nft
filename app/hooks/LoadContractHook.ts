import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect, useState } from "react";

import NFT_ABI from "../abis/NFT.json";
import config from "../config.json";

export function useLoadContract() {
  const [nft, setNFT] = useState<Contract>();
  const [revealTime, setRevealTime] = useState<string>("");
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const { provider, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const loadContract = async () => {
    try {
      setLoading(true);

      const nft = new Contract(config[31337].nft.address, NFT_ABI, provider);
      setNFT(nft);

      // Countdown
      const allowMintingOn = await nft.allowMintingOn();
      setRevealTime(allowMintingOn.toString() + "000");

      setMaxSupply(await nft.maxSupply());
      setTotalSupply(await nft.totalSupply());
      setCost(await nft.cost());
      setBalance(await nft.balanceOf(account));
    } catch (error) {
      console.error("Error while loading nft contract. ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadContract();
    }
  }, [account]);

  return { nft, revealTime, maxSupply, totalSupply, cost, balance, loading };
}

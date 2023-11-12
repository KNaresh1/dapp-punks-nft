const hre = require("hardhat");

const ether = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  const NAME = "Dapp Punks";
  const SYMBOL = "DP";
  const COST = ether(10);
  const MAX_SUPPLY = 25;
  const NFT_MINT_DATE = (Date.now() + 60000).toString().slice(0, 10); // 1 min from now
  const IPFS_METADATA_URI =
    "ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/";

  // Fetch contract to deploy
  const NFT = await hre.ethers.getContractFactory("NFT");

  // Deploy contract
  let nft = await NFT.deploy(
    NAME,
    SYMBOL,
    COST,
    MAX_SUPPLY,
    NFT_MINT_DATE,
    IPFS_METADATA_URI
  );
  await nft.deployed();

  console.log(`NFT deployed to: ${nft.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

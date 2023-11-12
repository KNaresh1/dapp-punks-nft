const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("NFT", () => {
  const NAME = "Dapp Punks";
  const SYMBOL = "DP";
  const COST = ether(10);
  const MAX_SUPPLY = 25;
  const BASE_URI = "ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/";

  let nft, deployer, minter;

  beforeEach(async () => {
    [deployer, minter] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10); // 2 mins from now

    beforeEach(async () => {
      const NFT = await ethers.getContractFactory("NFT");
      nft = await NFT.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        ALLOW_MINTING_ON,
        BASE_URI
      );
    });

    it("has correct name", async () => {
      expect(await nft.name()).to.equal(NAME);
    });

    it("has correct symbol", async () => {
      expect(await nft.symbol()).to.equal(SYMBOL);
    });

    it("returns cost of nft to mint", async () => {
      expect(await nft.cost()).to.equal(COST);
    });

    it("returns the maximum total supply", async () => {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("returns the allowed minting time", async () => {
      expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON);
    });

    it("returns the base uri", async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI);
    });

    it("returns the owner", async () => {
      expect(await nft.owner()).to.equal(deployer.address);
    });
  });

  describe("Minting", () => {
    let transaction, result;

    describe("Success", () => {
      const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

      beforeEach(async () => {
        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        transaction = await nft.connect(minter).mint(1, { value: COST });
        result = await transaction.wait();
      });

      it("updates the total supply", async () => {
        expect(await nft.totalSupply()).to.equal(1);
      });

      it("returns the address of the minter", async () => {
        expect(await nft.ownerOf(1)).to.equal(minter.address);
      });

      it("returns total nfts owned by minter", async () => {
        expect(await nft.balanceOf(minter.address)).to.equal(1);
      });

      it("returns IPFS URI", async () => {
        expect(await nft.tokenURI(1)).to.equal(`${BASE_URI}1.json`);
      });

      it("updates the contract ether balance", async () => {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST);
      });

      it("emits Mint event", async () => {
        await expect(transaction)
          .to.emit(nft, "Mint")
          .withArgs(1, minter.address);
      });
    });

    describe("Failure", () => {
      it("rejects minting before allowed time", async () => {
        const ALLOW_MINTING_ON = new Date("November 12, 2025 18:00:00")
          .getTime()
          .toString()
          .slice(0, 10);

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        await expect(nft.connect(minter).mint(1, { value: COST })).to.be
          .reverted;
      });

      it("requires atleast 1 NFT to be minted", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        await expect(nft.connect(minter).mint(0, { value: COST })).to.be
          .reverted;
      });

      it("does not allow more NFTs to be minted than max supply", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        await expect(nft.connect(minter).mint(100, { value: ether(100 * 10) }))
          .to.be.reverted;
      });

      it("rejects insufficient payment", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        await expect(nft.connect(minter).mint(1, { value: ether(1) })).to.be
          .reverted;
      });

      it("does not return URIs for invalid tokens", async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          ALLOW_MINTING_ON,
          BASE_URI
        );

        await expect(nft.tokenURI(99)).to.be.reverted;
      });
    });
  });

  describe("Displaying NFTs", () => {
    const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10); // Now

    beforeEach(async () => {
      const NFT = await ethers.getContractFactory("NFT");
      nft = await NFT.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        ALLOW_MINTING_ON,
        BASE_URI
      );
      // Mint 3 nfts
      transaction = await nft.connect(minter).mint(3, { value: ether(3 * 10) });
      result = await transaction.wait();
    });

    it("returns all the NFTs for a given owner", async () => {
      let tokenIds = await nft.walletOfOwner(minter.address);
      expect(tokenIds.length).to.equal(3);
      expect(tokenIds[0].toString()).to.equal("1");
      expect(tokenIds[1].toString()).to.equal("2");
      expect(tokenIds[2].toString()).to.equal("3");
    });
  });
});

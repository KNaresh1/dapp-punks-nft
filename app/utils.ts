import { ethers } from "ethers";

export const formatUnits = (value: number) => {
  return ethers.utils.formatUnits(value.toString(), "ether");
};

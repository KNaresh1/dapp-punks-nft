import { Stack, Text } from "@chakra-ui/react";
import { formatUnits } from "../utils";

interface MintDataProps {
  maxSupply: number;
  totalSupply: number;
  cost: number;
  balance: number;
}

const MintData = ({ maxSupply, totalSupply, cost, balance }: MintDataProps) => {
  return (
    <Stack spacing={4}>
      <Text>
        <strong>Available to Mint: </strong>
        {maxSupply - totalSupply}
      </Text>
      <Text>
        <strong>Cost to Mint: </strong>
        {formatUnits(cost)} ETH
      </Text>
      <Text>
        <strong>You own: </strong>
        {balance.toString()}
      </Text>
    </Stack>
  );
};

export default MintData;

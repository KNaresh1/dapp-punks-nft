import { Box, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useForm } from "react-hook-form";

interface MintProps {
  nft: Contract | undefined;
  cost: number;
}

const Mint = ({ nft, cost }: MintProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { provider } = useWeb3React();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const signer = provider?.getSigner() || "0x0";

      const transaction = await nft?.connect(signer).mint(1, { value: cost });
      await transaction.wait();
    } catch (error) {
      console.log("User rejected or transaction reverted. ", error);
    }
  });

  return (
    <Box mt={4}>
      <form onSubmit={onSubmit}>
        <Button
          mt={4}
          width="md"
          colorScheme="blue"
          isLoading={isSubmitting}
          type="submit"
        >
          Mint
        </Button>
      </form>
    </Box>
  );
};

export default Mint;

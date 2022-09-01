import { useContractWrite, usePrepareContractWrite } from "wagmi";
import tokenClaim from "../lib/abis/TokenClaim.json";

export function useClaimTokens() {
  const { config } = usePrepareContractWrite({
    addressOrName: tokenClaim.address,
    contractInterface: tokenClaim.abi,
    functionName: "claimTokens",
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);
  return { write, isLoading, isSuccess };
}

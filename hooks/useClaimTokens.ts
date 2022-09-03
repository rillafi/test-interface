import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";
import tokenClaim from "../lib/abis/5/TokenClaim.json";

export function useClaimTokens() {
  const { config } = usePrepareContractWrite({
    addressOrName: tokenClaim.address,
    contractInterface: tokenClaim.abi,
    functionName: "claimTokens",
  });
  const { data, write, isLoading, isIdle, isSuccess } =
    useContractWrite(config);
  return { data, write, isLoading, isIdle, isSuccess };
}

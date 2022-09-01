import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";
import { useChainId } from "./useChainId";
import { useState, useEffect } from "react";
import tokenClaim from "../lib/abis/5/TokenClaim.json";

export function useClaimTokens() {
  // const chainId = useChainId();
  // const [tokenClaim, setTokenClaim] = useState<any>({});
  // useEffect(() => {
  //   if (!chainId) return;
  //   const setThem = async () => {
  //     setTokenClaim(await import(`../lib/abis/${chainId}/TokenClaim.json`));
  //   };
  //   setThem();
  // }, [chainId]);
  const { config } = usePrepareContractWrite({
    addressOrName: tokenClaim.address,
    contractInterface: tokenClaim.abi,
    functionName: "claimTokens",
  });
  const { data, write, isLoading, isIdle, isSuccess } =
    useContractWrite(config);
  return { data, write, isLoading, isIdle, isSuccess };
}

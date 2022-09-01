import { useEffect } from "react";
import { ethers } from "ethers";
import { usePrepareContractWrite, useContractWrite, erc20ABI } from "wagmi";
export function useTokenApprove(contractAddress: string, address: string) {
  const { config } = usePrepareContractWrite({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [contractAddress, ethers.constants.MaxUint256],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return { data, isSuccess, write };
}
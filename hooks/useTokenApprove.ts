import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useWaitForTransaction,
} from "wagmi";
import { useTxnToast } from "./useTxnToast";

export function useTokenApprove(spenderAddress: string, tokenAddress: string) {
  const { config } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, ethers.constants.MaxUint256],
  });
  const { write, data, error } = useContractWrite(config);
  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  useTxnToast({ data, error, isError, isLoading, isSuccess });
  return { write, isSuccess, data, isError, isLoading };
}

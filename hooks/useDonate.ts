import { useEffect } from "react";
import { ethers } from "ethers";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import donationRouter from "../lib/abis/5/DonationRouter.json";

export function useDonate(contractAddress: string, amount: string) {
  const { config } = usePrepareContractWrite({
    addressOrName: donationRouter.address,
    contractInterface: donationRouter.abi,
    functionName: "donate",
    args: [contractAddress, amount],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return { data, isLoading, isSuccess, write };
}

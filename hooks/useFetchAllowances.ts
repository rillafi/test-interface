import { useContractReads, useAccount, erc20ABI } from "wagmi";
import { useEffect } from "react";
import donationRouter from "../lib/abis/5/DonationRouter.json";

export function useFetchAllowances(contractAddresses: string[]) {
  const { address } = useAccount();

  const { data, refetch } = useContractReads({
    contracts: contractAddresses.map((addy) => {
      return {
        addressOrName: addy,
        contractInterface: erc20ABI,
        functionName: "allowance",
        args: [address, donationRouter.address],
      };
    }),
  });
  return { data, refetch };
}

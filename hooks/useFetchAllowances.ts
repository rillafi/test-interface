import { useContractReads, useAccount, erc20ABI } from "wagmi";
// import donationRouter from "../lib/abis/5/DonationRouter.json"; // if shit fucks up, enable this
import { useRillaContractInfo } from "./useRillaContractInfo";

export function useFetchAllowances(contractAddresses: string[]) {
  const { address } = useAccount();
  const { data: donationRouter, isLoading } =
    useRillaContractInfo("DonationRouter");

  return useContractReads({
    contracts: isLoading
      ? []
      : contractAddresses.map((addy) => {
          return {
            addressOrName: addy,
            contractInterface: erc20ABI,
            functionName: "allowance",
            args: [address, donationRouter.address],
          };
        }),
  });
}

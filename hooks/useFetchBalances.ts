import { useAccount, erc20ABI, useContractReads } from "wagmi";

export function useFetchBalances(contractAddresses: string[]) {
  const { address } = useAccount();
  return useContractReads({
    contracts: contractAddresses.map((addy) => {
      return {
        addressOrName: addy,
        contractInterface: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      };
    }),
  });
}

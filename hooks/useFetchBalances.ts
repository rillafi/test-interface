import { useAccount, erc20ABI, useContractReads } from "wagmi";
import { useEffect } from "react";
export function useFetchBalances(contractAddresses: string[]) {
  const { address } = useAccount();
  const { data, refetch } = useContractReads({
    contracts: contractAddresses.map((addy) => {
      return {
        addressOrName: addy,
        contractInterface: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      };
    }),
  });
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return { data, refetch };
}

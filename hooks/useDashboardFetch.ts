import { useEffect, useState, useCallback } from "react";
import { useContractReads, useAccount, useBalance } from "wagmi";
import tokenClaim from "../lib/abis/5/TokenClaim.json";
import donationRouter from "../lib/abis/5/DonationRouter.json";

const dataInit = [0, 0, false, false];
export function useDashboardFetch() {
  const tokenClaimContract = {
    addressOrName: tokenClaim.address,
    contractInterface: tokenClaim.abi,
  };
  const donationRouterContract = {
    addressOrName: donationRouter.address,
    contractInterface: donationRouter.abi,
  };
  const [data, setData] = useState<any[]>(dataInit);
  const { address } = useAccount();
  const { data: balanceData, refetch: fetchBalance } = useBalance({
    addressOrName: address,
  });
  const { data: readData, refetch: fetchContractReads } = useContractReads({
    contracts: [
      {
        ...tokenClaimContract,
        functionName: "taskClaimedTokens",
        args: [address],
      },
      {
        ...donationRouterContract,
        functionName: "taskDonateTRilla",
        args: [address],
      },
      {
        ...donationRouterContract,
        functionName: "taskDonateRillaUSDC",
        args: [address],
      },
    ],
  });
  const refetch = useCallback(() => {
    fetchBalance();
    fetchContractReads();
  }, [fetchBalance, fetchContractReads]);

  useEffect(() => {
    if (!balanceData || !readData) return;
    setData([Number(balanceData.formatted), ...readData]);
  }, [balanceData, readData]);

  useEffect(() => {
    setData(dataInit);
    refetch();
  }, [address, refetch]);

  return { data, refetch };
}

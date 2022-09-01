import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractReads,
  useAccount,
  useBalance,
} from "wagmi";
import tokenClaimAbi from "../lib/abis/TokenClaim.json";
import donationRouterAbi from "../lib/abis/DonationRouter.json";

const tokenClaimContract = {
  addressOrName: tokenClaimAbi.address,
  contractInterface: tokenClaimAbi.abi,
};
const donationRouterContract = {
  addressOrName: donationRouterAbi.address,
  contractInterface: donationRouterAbi.abi,
};

const dataInit = [0, 0, false, false];
export function useDashboardFetch() {
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
  const refetch = () => {
    fetchBalance();
    fetchContractReads();
  };

  useEffect(() => {
    if (!balanceData || !readData) return;
    setData([Number(balanceData.formatted), ...readData]);
  }, [balanceData, readData]);
  useEffect(() => {
    setData(dataInit);
    refetch();
  }, [address]);
  return { data, refetch };
}

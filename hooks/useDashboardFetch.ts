import { useEffect, useCallback, useMemo } from "react";
import { useContractReads, useAccount, useBalance } from "wagmi";
import { useContracts } from "./useContracts";

const dataInit = [0, 0, false, false];
export function useDashboardFetch() {
  const { contracts, isLoading } = useContracts();
  const { address } = useAccount();
  const { data: balanceData, refetch: fetchBalance } = useBalance({
    addressOrName: address,
  });
  const { data: readData, refetch: fetchContractReads } = useContractReads({
    contracts: isLoading
      ? []
      : [
          {
            addressOrName: contracts?.TokenClaim?.address,
            contractInterface: contracts?.TokenClaim?.abi,
            functionName: "taskClaimedTokens",
            args: [address],
          },
          {
            addressOrName: contracts?.DonationRouter.address,
            contractInterface: contracts?.DonationRouter.abi,
            functionName: "taskDonateTRilla",
            args: [address],
          },
          {
            addressOrName: contracts?.DonationRouter.address,
            contractInterface: contracts?.DonationRouter.abi,
            functionName: "taskDonateRillaUSDC",
            args: [address],
          },
        ],
  });
  const refetch = useCallback(() => {
    fetchBalance();
    fetchContractReads();
  }, [fetchBalance, fetchContractReads]);

  const data = useMemo(() => {
    if (
      !balanceData ||
      !readData ||
      readData.length === 0 ||
      !balanceData ||
      readData.some((val) => val === null)
    )
      return dataInit;
    return [Number(balanceData.formatted), ...readData];
  }, [balanceData, readData]);

  useEffect(() => {
    refetch();
  }, [address, refetch]);

  return { data, refetch };
}

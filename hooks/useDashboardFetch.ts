import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractReads,
  useAccount,
  useBalance,
} from "wagmi";
import { useChainId } from "./useChainId";
import tokenClaim from "../lib/abis/5/TokenClaim.json";
import donationRouter from "../lib/abis/5/DonationRouter.json";

const dataInit = [0, 0, false, false];
export function useDashboardFetch() {
  // const chainId = useChainId();
  // const [donationRouter, setDonationRouter] = useState<any>({});
  // const [tokenClaim, setTokenClaim] = useState<any>({});

  // useEffect(() => {
  //   if (!chainId) return;
  //   const setThem = async () => {
  //     console.log(chainId);
  //     setDonationRouter(
  //       await import(`../lib/abis/${chainId}/DonationRouter.json`)
  //     );
  //     setTokenClaim(await import(`../lib/abis/${chainId}/TokenClaim.json`));
  //   };
  //   setThem();
  // }, [chainId]);
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

  // useEffect(() => {
  //   console.log(donationRouter);
  // }, [donationRouter]);
  return { data, refetch };
}

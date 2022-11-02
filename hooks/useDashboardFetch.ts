import { useEffect, useCallback, useMemo } from "react";
import { useContractRead, useContractReads, useAccount, useBalance } from "wagmi";
import { useContracts } from "./useContracts";

const dataInit = [0, 0, false, false, 0, 0];
export function useDashboardFetch() {
    const { contracts, isLoading } = useContracts();
    const { address } = useAccount();
    const { data: balanceData, refetch: fetchBalance } = useBalance({
        addressOrName: address,
    });
    const { data: readData, refetch: fetchContractReads, isFetching } = useContractReads({
        contracts: isLoading ? [] : [
            {
                addressOrName: contracts?.TokenClaim?.address,
                contractInterface: contracts?.TokenClaim?.abi,
                functionName: "taskClaimedTokens",
                args: [address],
            },
            {
                addressOrName: contracts?.DonationRouter?.address,
                contractInterface: contracts?.DonationRouter?.abi,
                functionName: "taskDonateTRilla",
                args: [address],
            },
            {
                addressOrName: contracts?.DonationRouter?.address,
                contractInterface: contracts?.DonationRouter?.abi,
                functionName: "taskDonateRillaUSDC",
                args: [address],
            },
            {
                addressOrName: contracts?.tRILLA?.address,
                contractInterface: contracts?.tRILLA?.abi,
                functionName: "allowance",
                args: [address, contracts?.VoteEscrow?.address],
            },
            {
                addressOrName: contracts?.VoteEscrow?.address,
                contractInterface: contracts?.VoteEscrow?.abi,
                functionName: "user_point_history__ts",
                args: [address, 1],
            },
            // allTokens
        ],
    });
    /* const readData = useMemo(() => [taskClaimedTokens, taskDonateTRilla, taskDonateRillaUSDC, allowance, balanceOf], [taskClaimedTokens, taskDonateTRilla, taskDonateRillaUSDC, allowance, balanceOf]); */
    const refetch = useCallback(() => {
        fetchBalance();
        /* fetchContractReads(); */
    }, [fetchBalance]);

    const data = useMemo(() => {
        if (
            !balanceData ||
                !readData ||
                readData.length === 0 ||
                !balanceData ||
                readData.some((val) => val === null || val == undefined)
        ) return dataInit;
        return [Number(balanceData.formatted), ...readData];
    }, [balanceData, readData]);

    useEffect(() => {
        /* if (readData && readData.some(v => val == null)) { */
        /*     refetch(); */
        /* } */
        refetch();
    }, [address, refetch]);

    return { data, refetch };
}

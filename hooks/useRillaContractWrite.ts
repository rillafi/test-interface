import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
    usePrepareContractWrite,
    useWaitForTransaction,
    useContractWrite,
    useProvider,
    useNetwork
} from "wagmi";
import { useChainId } from "wagmi/dist/declarations/src/hooks";
import { useContracts } from "./useContracts";
import { useTxnToast } from "./useTxnToast";

async function getGasEstimate(provider, contracts, contractName, functionName, args) {
    console.log(contracts)
    const contract = new ethers.Contract(contracts[contractName]?.address, contracts[contractName]?.abi, provider);
    const gasEstimate = await contract.estimateGas[functionName](...args);
    return gasEstimate;
};

export function useRillaContractWrite(
    contractName: string,
    functionName: string,
    args: any[]
) {
    const { contracts, isLoading: contractsLoading } = useContracts();
    const { chain } = useNetwork();
    const { config } = usePrepareContractWrite({
        addressOrName: contracts[contractName]?.address,
        contractInterface: contracts[contractName]?.abi,
        functionName,
        args,
        overrides: contractName !== "VoteEscrow" ? undefined : {
            gasLimit: 1000000 
        },
    });
    const { write, data, error } = useContractWrite(config);
    const { isError, isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });
    useTxnToast({ data, error, isError, isLoading, isSuccess });
    return { write, isSuccess, data, isError, isLoading };
}

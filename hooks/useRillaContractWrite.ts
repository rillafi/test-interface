import { usePrepareContractWrite, useContractWrite, useNetwork } from "wagmi";
import { useContracts } from "./useContracts";

export function useRillaContractWrite(
  contractName: string,
  functionName: string,
  args: any[] = []
) {
  const { contracts, isLoading } = useContracts();
  const { config } = usePrepareContractWrite({
    addressOrName: contracts[contractName]?.address,
    contractInterface: contracts[contractName]?.abi,
    functionName,
    args,
  });
  return useContractWrite(config);
}

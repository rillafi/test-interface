import {
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractWrite,
} from "wagmi";
import { useContracts } from "./useContracts";
import { useTxnToast } from "./useTxnToast";

export function useRillaContractWrite(
  contractName: string,
  functionName: string,
  args: any[] = []
) {
  const { contracts, isLoading: contractsLoading } = useContracts();
  const { config } = usePrepareContractWrite({
    addressOrName: contracts[contractName]?.address,
    contractInterface: contracts[contractName]?.abi,
    functionName,
    args,
  });
  const { write, data, error } = useContractWrite(config);
  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  useTxnToast({ data, error, isError, isLoading, isSuccess });
  return { write, isSuccess, data, isError, isLoading };
}

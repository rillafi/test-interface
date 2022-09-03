import { useState, useEffect } from "react";
import { usePrepareContractWrite, useContractWrite, useNetwork } from "wagmi";
import { getContractState } from "../lib/getContract";
import { ContractInfo } from "../lib/getContract";

export function useRillaContractWrite(
  contractName: string,
  functionName: string,
  args: any[] = []
) {
  const { chain } = useNetwork();
  const [contract, setContract] = useState({} as ContractInfo);
  useEffect(() => {
    if (!chain) return;
    const fetchIt = async () => {
      await getContractState(5, contractName, setContract);
    };
    fetchIt();
  }, [chain, contractName]);
  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: contract.abi,
    functionName,
    args,
  });
  return useContractWrite(config);
}

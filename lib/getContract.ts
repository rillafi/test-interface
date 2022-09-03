import { ethers } from "ethers";

export interface ContractInfo {
  abi: {}[];
  deployedTransaction: {
    hash: string;
    from: string;
    gasPrice: ethers.BigNumber;
    gasLimit: ethers.BigNumber;
    value: ethers.BigNumber;
    data: string;
    r: string;
    s: string;
    v: number;
    chainId: number;
  };
  address: string;
  network: {
    name: string;
    chainId: number;
    ensAddress: string;
  };
  verified: boolean;
  contractName: string;
  constructorArguments: any[];
}

export function getContract(chainid, name) {
  return fetch(`/api/contractInfo?chainId=${chainid}&contractName=${name}`)
    .then((res) => res.json())
    .then((data: ContractInfo) => data);
}
export async function getContractState(chainid, name, setState) {
  setState(
    await fetch(`/api/contractInfo?chainId=${chainid}&contractName=${name}`)
      .then((res) => res.json())
      .then((data: ContractInfo) => data)
  );
}

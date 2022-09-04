import React, { createContext, useMemo, useContext, useState } from "react";
import { useNetwork } from "wagmi";
import { isDev } from "../lib/config";
import { useQueries } from "@tanstack/react-query";
import { ContractInfo } from "../lib/getContract";

const desiredContracts = ["DonationRouter", "TokenClaim"];
interface ContractsResult {
  DonationRouter?: ContractInfo;
  TokenClaim?: ContractInfo;
}

const ContractsContext = createContext<
  { contracts: ContractsResult | undefined; isLoading: boolean } | undefined
>(undefined);

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  const queries = useQueries({
    queries: desiredContracts.map((contractName) => {
      return {
        queryKey: ["contract", contractName, chain?.id],
        queryFn: () =>
          fetch(
            `/api/contractInfo?chainId=${
              isDev ? 5 : chain?.id
            }&contractName=${contractName}`
          ).then((res) => res.json()),
      };
    }),
  });

  const value = useMemo(() => {
    const isLoading = queries.some((res) => res.isLoading);
    if (!queries) return { contracts: undefined, isLoading };
    let contracts: ContractsResult = {};
    if (queries.length > 0 && !isLoading) {
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i].data as ContractInfo;
        contracts[query.contractName] = query;
      }
    }
    return { contracts, isLoading };
  }, [queries]);

  return (
    <ContractsContext.Provider value={value}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContracts() {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}

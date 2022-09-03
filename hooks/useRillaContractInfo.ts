import { useNetwork } from "wagmi";
import { useEffect } from "react";
import useSWR from "swr";
import { isDev } from "../lib/config";
import { useQuery } from "@tanstack/react-query";

export function useRillaContractInfo(contractName: string) {
  const { chain } = useNetwork();

  const { isLoading, error, data } = useQuery(["contractInfo"], () =>
    fetch(
      `/api/contractInfo?chainId=${
        isDev ? 5 : chain?.id
      }&contractName=${contractName}`
    ).then((res) => res.json())
  );
  useEffect(() => console.log(data, isLoading), [data, isLoading, error]);
  return { data, isLoading, error };
}

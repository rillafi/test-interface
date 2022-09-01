import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import tokenList from "../lib/tokenList.json";

export interface TokenListElement {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  chainId: number;
  balance?: number;
  allowance?: number;
}

export function useChainTokenList(): { data: TokenListElement[] } {
  const { chain } = useNetwork();
  const [data, setData] = useState([] as TokenListElement[]);

  useEffect(() => {
    if (!chain) return;
    // TODO: Change elem.chainId == 10 to elem.chainId == chain.id
    const newChainTokenList = tokenList
      .filter((elem) => elem.chainId == 10)
      .sort((a, b) => a.name.localeCompare(b.name));
    setData(newChainTokenList);
  }, [chain]);
  return { data };
}

import { useState, useEffect } from "react";
import { TokenListElement } from "./useChainTokenList";
import { useFetchAllowances } from "./useFetchAllowances";
import { useFetchBalances } from "./useFetchBalances";
import { useChainTokenList } from "./useChainTokenList";
import { ethers } from "ethers";

export function useTokenList() {
  const [currentToken, setCurrentToken] = useState({} as TokenListElement);
  const [tokenList, setTokenList] = useState([] as TokenListElement[]);
  const { data: chainTokenList } = useChainTokenList();
  const { data: tokenAllowances, refetch: refetchAllowances } =
    useFetchAllowances(chainTokenList.map((elem) => elem.address));
  const { data: tokenBalances, refetch: refetchBalances } = useFetchBalances(
    chainTokenList.map((elem) => elem.address)
  );

  const refetch = () => {
    refetchAllowances();
    refetchBalances();
  };

  useEffect(() => {
    if (tokenList.length == 0) return;
    if (Object.keys(currentToken).length > 0) return; // avoid resetting token when updating token approvals or balances
    setCurrentToken(tokenList.find((elem) => elem.symbol == "tRILLA"));
    console.log(tokenList[0]);
  }, [tokenList]);

  useEffect(() => {
    const tokenListCopy = chainTokenList.map((token, i) => {
      const tokenCopy = Object.assign({ allowance: 0 }, token);
      tokenCopy.allowance = tokenAllowances
        ? Number(ethers.utils.formatUnits(tokenAllowances[i], token.decimals))
        : 0;
      tokenCopy.balance = tokenBalances
        ? Number(ethers.utils.formatUnits(tokenBalances[i], token.decimals))
        : 0;
      return tokenCopy;
    });
    setTokenList(tokenListCopy);
  }, [tokenAllowances, chainTokenList, tokenBalances]);
  useEffect(() => {
    if (!currentToken || !tokenList) return;
    if (!tokenList.find((elem) => elem.symbol === currentToken.symbol)) return;
    // if () {
    setCurrentToken(
      tokenList.find((elem) => elem.symbol === currentToken.symbol)
    );
    // }
  }, [tokenList, currentToken]);

  return { currentToken, setCurrentToken, tokenList, refetch };
}

import { useAccount } from "wagmi";
import { useContractReads } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { TokenListElement } from "./useChainTokenList";
import { useChainTokenList } from "./useChainTokenList";
import { ethers } from "ethers";
import { useRillaContractInfo } from "./useRillaContractInfo";
import { erc20ABI } from "wagmi";

export function useTokenList() {
  const { address } = useAccount();
  const [currentToken, setCurrentToken] = useState({} as TokenListElement);
  const { data: chainTokenList } = useChainTokenList();
  const { data: donationRouter, isLoading } =
    useRillaContractInfo("DonationRouter");
  const { data: tokenData, refetch } = useContractReads({
    contracts: isLoading
      ? []
      : [
          ...chainTokenList.map((token) => {
            return {
              addressOrName: token.address,
              contractInterface: erc20ABI,
              functionName: "allowance",
              args: [address, donationRouter.address],
            };
          }),
          ...chainTokenList.map((token) => {
            return {
              addressOrName: token.address,
              contractInterface: erc20ABI,
              functionName: "balanceOf",
              args: [address],
            };
          }),
        ],
  });

  const tokenList = useMemo(() => {
    if (!chainTokenList || !tokenData) return [];
    if (tokenData.length == 0) return chainTokenList;
    return chainTokenList.map((token, i) => {
      token.allowance = Number(ethers.utils.formatEther(tokenData[i]));
      token.balance = Number(
        ethers.utils.formatEther(tokenData[i + chainTokenList.length])
      );
      return token;
    });
  }, [chainTokenList, tokenData]);

  useEffect(() => {
    if (tokenList.length == 0) return;
    if (Object.keys(currentToken).length > 0) return;
    setCurrentToken(tokenList.find((elem) => elem.symbol == "tRILLA"));
  }, [tokenList, currentToken]);

  return { currentToken, setCurrentToken, tokenList, refetch };
}

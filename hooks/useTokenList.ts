import { useAccount } from "wagmi";
import { useContractReads } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { TokenListElement } from "./useChainTokenList";
import { useChainTokenList } from "./useChainTokenList";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";
import { useContracts } from "./useContracts";

export function useTokenList() {
  const { address } = useAccount();
  const { contracts, isLoading } = useContracts();
  const [currentToken, setCurrentToken] = useState({} as TokenListElement);
  const { data: chainTokenList } = useChainTokenList();
  const { data: tokenData, refetch } = useContractReads({
    contracts:
      isLoading || chainTokenList.length == 0 || contracts === undefined
        ? []
        : [
            ...chainTokenList.flatMap((token) => [
              {
                addressOrName: token.address,
                contractInterface: erc20ABI,
                functionName: "allowance",
                args: [address, contracts?.DonationRouter.address],
              },
              {
                addressOrName: token.address,
                contractInterface: erc20ABI,
                functionName: "balanceOf",
                args: [address],
              },
            ]),
          ],
  });
  const tokenList = useMemo(() => {
    if (!chainTokenList || !tokenData) return [];
    if (tokenData.length == 0 || tokenData.some((val) => val == null))
      return chainTokenList;
    return chainTokenList.map((token, i) => {
      token.allowance = Number(ethers.utils.formatEther(tokenData[2 * i]));
      token.balance = Number(ethers.utils.formatEther(tokenData[2 * i + 1]));
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

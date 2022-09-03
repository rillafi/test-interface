import { ContractInfo, getContractState } from "./../lib/getContract";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import { erc20ABI } from "wagmi";
import { useContractReads } from "wagmi";
import { useState, useEffect } from "react";
import { TokenListElement } from "./useChainTokenList";
import { useFetchAllowances } from "./useFetchAllowances";
import { useFetchBalances } from "./useFetchBalances";
import { useChainTokenList } from "./useChainTokenList";
import { ethers } from "ethers";
import { getContract } from "../lib/getContract";
import useSWR from "swr";

export function useTokenList() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [donationRouter, setDonationRouter] = useState({} as ContractInfo);
  useEffect(() => {
    if (!chain) return;
    getContractState(5, "DonationRouter", setDonationRouter);
  }, [chain]);
  // const { data: donationRouter } = useSWR([5, "DonationRouter"], getContract);
  const [currentToken, setCurrentToken] = useState({} as TokenListElement);
  const [tokenList, setTokenList] = useState([] as TokenListElement[]);
  const { data: chainTokenList } = useChainTokenList();
  // const { data: tokenAllowances, refetch: refetchAllowances } =
  //   useFetchAllowances(chainTokenList.map((elem) => elem.address));
  // const contracts = ;
  const { data: tokenDetails, refetch } = useContractReads({
    contracts: [
      ...tokenList.map((token) => {
        return {
          addressOrName: token.address,
          contractInterface: erc20ABI,
          functionName: "allowance",
          args: [address, donationRouter?.address],
        };
      }),
      ...tokenList.map((token) => {
        return {
          addressOrName: token.address,
          contractInterface: erc20ABI,
          functionName: "balanceOf",
          args: [address],
        };
      }),
    ],
  });
  useEffect(() => {
    console.log(donationRouter);
  }, [donationRouter]);
  // useEffect(() => {
  //   setTokenList(chainTokenList);
  // }, [chainTokenList]);
  // const { data: tokenBalances, refetch: refetchBalances } = useFetchBalances(
  //   chainTokenList.map((elem) => elem.address)
  // );

  // const refetch = () => {
  //   refetchAllowances();
  //   refetchBalances();
  // };

  useEffect(() => {
    if (tokenList.length == 0) return;
    if (Object.keys(currentToken).length > 0) return; // avoid resetting token when updating token approvals or balances
    setCurrentToken(tokenList.find((elem) => elem.symbol == "tRILLA"));
  }, [tokenList, currentToken]);

  useEffect(() => {
    let list = chainTokenList.map((token) =>
      Object.assign({ allowance: 0, balance: 0 }, token)
    );
    if (tokenDetails && tokenDetails.length !== 0) {
      const dbal = tokenDetails.length / 2;
      list = chainTokenList.map((token, i) => {
        const copy = Object.assign({ allowance: 0, balance: 0 }, token);
        copy.allowance = Number(ethers.utils.formatUnits(tokenDetails[i]));
        copy.balance = Number(ethers.utils.formatUnits(tokenDetails[i + dbal]));
        return copy;
      });
    }
    setTokenList(list);
  }, [tokenDetails, chainTokenList, donationRouter]);
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

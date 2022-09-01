import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";

export function useChainId() {
  const { chain } = useNetwork();
  const [chainId, setChainId] = useState<number | null>(null);
  useEffect(() => {
    if (!chain) return;
    setChainId(chain.id);
  }, [chain]);

  return chainId;
}

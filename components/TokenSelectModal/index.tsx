import styles from "./index.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TokenListElement } from "../../hooks/useChainTokenList";
import { ethers } from "ethers";

export default function TokenSelectModal({
  setOpen,
  setCurrentToken,
  tokenList,
}: {
  setOpen: Function;
  setCurrentToken: Function;
  tokenList: TokenListElement[];
}) {
  const [tokenName, setTokenName] = useState("");
  const [mTokenList, setMTokenList] = useState(tokenList);

  useEffect(() => {
    setMTokenList(
      tokenList.filter(
        (token) =>
          token.name.toLowerCase().includes(tokenName) ||
          token.symbol.toLowerCase().includes(tokenName)
      )
    );
  }, [tokenName]);

  return (
    <div className={styles.centerModal}>
      <div className={styles.modalBackdrop} onClick={() => setOpen(false)} />
      <div className={styles.modal}>
        <div className={styles.headerSection}>
          <div className={styles.titleRow}>
            <span>Select a token</span>
            <div className={styles.imgContainer} onClick={() => setOpen(false)}>
              <Image layout="fill" src="/images/svgs/menuClose.svg" />
            </div>
          </div>
          <div className={styles.searchInputSection}>
            <input
              className={styles.searchInput}
              onChange={(e) => setTokenName(e.target.value.toLowerCase())}
              placeholder="Search name or paste address"
              autoFocus
            />
          </div>
        </div>
        <div className={styles.separator} />
        <div className={styles.allTokens}>
          {mTokenList.map((token: TokenListElement) => (
            <div
              className={styles.tokenContainer}
              onClick={() => {
                setCurrentToken(token);
                setOpen(false);
              }}
              key={token.name}
            >
              <div className={styles.tokenLogoFlex}>
                <div className={styles.tokenLogoContainer}>
                  <Image
                    layout="fill"
                    src={token.logoURI}
                    className={styles.tokenLogo}
                  />
                </div>
              </div>
              <div className={styles.tokenNameSymbolContainer}>
                <div className={styles.tokenNameContainer}>
                  <div className={styles.tokenName}>{token.name}</div>
                </div>
                <div className={styles.tokenSymbol}>{token.symbol}</div>
              </div>
              <div></div>
              <div className={styles.balanceContainer}>
                <span>{token.balance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

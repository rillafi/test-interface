import styles from "./index.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useDelayedInput } from "../../hooks/useDelayedInput";
import Image from "next/image";
import { useAccount } from "wagmi";
import TokenSelectModal from "../../components/TokenSelectModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenList } from "../../hooks/useTokenList";
import { useTokenApprove } from "../../hooks/useTokenApprove";
import Link from "next/link";
import { Snackbar } from "../../components/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useRillaContractWrite } from "../../hooks/useRillaContractWrite";
import { useContracts } from "../../hooks/useContracts";

function Donate() {
  const { contracts, isLoading } = useContracts();
  const { address } = useAccount();
  const [account, setAccount] = useState("");
  useEffect(() => {
    if (!address) return;
    setAccount(address);
  }, [address]);
  const {
    currentToken,
    setCurrentToken,
    tokenList,
    refetch: refetchTokenList,
  } = useTokenList();
  const [formInput, setFormInput] = useState("");
  const { isActive: donateIsActive, openSnackBar: donateOpenSnackbar } =
    useSnackbar({ timeout: 10000 });
  const { isActive: approveIsActive, openSnackBar: approveOpenSnackbar } =
    useSnackbar({ timeout: 10000 });
  const { delayedInput, delayedSetInput } = useDelayedInput("");
  const [open, setOpen] = useState(false);
  const {
    data: approveData,
    isSuccess: approveSuccess,
    write: approveToken,
  } = useTokenApprove(contracts.DonationRouter?.address, currentToken?.address);
  const {
    data: donateData,
    isSuccess: donationSuccess,
    isLoading: donateLoading,
    write: donateTokens,
  } = useRillaContractWrite("DonationRouter", "donate", [
    currentToken?.address,
    delayedInput,
  ]);
  useEffect(() => {
    if (!donateData) return;
    donateOpenSnackbar();
  }, [donateData, donateOpenSnackbar]);
  useEffect(() => {
    if (!approveData) return;
    donateOpenSnackbar();
  }, [approveData, donateOpenSnackbar]);
  useEffect(() => {
    refetchTokenList();
  }, [approveSuccess, donationSuccess, refetchTokenList]);

  const SnackbarComponentDonate = () => (
    <div className={styles.snackbarContainer}>
      <div className={styles.icon}>
        <Image
          layout="fill"
          src={
            donateLoading
              ? "/images/svgs/spinner.svg"
              : "/images/svgs/checkmark.svg"
          }
          alt="snackbar status icon"
        />
      </div>
      <Link href={`https://goerli.etherscan.io/tx/${donateData?.hash}`}>
        <a target="_blank" className={styles.explorerLink}>
          {donateLoading ? "View Transaction Status" : "Transaction Success"}
        </a>
      </Link>
    </div>
  );
  return (
    <>
      <Snackbar isActive={donateIsActive} Content={SnackbarComponentDonate} />
      <Snackbar isActive={approveIsActive} Content={SnackbarComponentDonate} />
      <main className={styles["root"]}>
        <section className={styles["paper"]}>
          <div className={styles["donateLine"]}>
            <div>
              <h3 className={styles["donate_title"]}>Donate</h3>
            </div>
          </div>
          <div className={styles["inputTokenSection"]}>
            <input
              className={styles["currencyInput"]}
              inputMode="decimal"
              placeholder="0.0"
              value={formInput}
              onChange={(e) => {
                const re = /^(\d+\.?\d*|\.\d+)$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setFormInput(e.target.value);
                  delayedSetInput(e.target.value);
                }
              }}
            />
            {Object.keys(currentToken).length == 0 ? (
              <button
                className={[styles.currencySelector, styles.greenBg].join(" ")}
                onClick={() => setOpen(true)}
              >
                <span>
                  <span className={`${styles.textContainer} ${styles.oneLine}`}>
                    Select token
                  </span>
                  <span className={styles.svgDown}>
                    <Image
                      layout="fill"
                      src="/images/svgs/downCarat.svg"
                      alt="dropdown icon"
                    />
                  </span>
                </span>
              </button>
            ) : (
              <button
                className={styles["currencySelector"]}
                onClick={() => setOpen(true)}
              >
                <span>
                  <div className={styles.imgAndText}>
                    <div className={styles.imgContainer}>
                      <Image
                        className={styles.img}
                        layout="fill"
                        src={currentToken.logoURI}
                        alt={`${currentToken.symbol} logo`}
                      />
                    </div>
                  </div>
                  <span className={styles.textContainer}>
                    {Object.keys(currentToken).length == 0
                      ? "Select Token"
                      : currentToken.symbol}
                  </span>
                  <span className={styles.svgDown}>
                    <Image
                      layout="fill"
                      src="/images/svgs/downCarat.svg"
                      alt="dropdown icon"
                    />
                  </span>
                </span>
              </button>
            )}
          </div>
          <div className={styles.outputTokenSection}>
            <input
              className={styles["currencyInput"]}
              inputMode="decimal"
              placeholder="0.0"
              value={delayedInput}
              readOnly
            />
            <button className={styles["currencySelector"]}>
              <span>
                <div className={styles.imgAndText}>
                  <div className={styles.imgContainer}>
                    <Image
                      className={styles.img}
                      layout="fill"
                      src={"/images/usdcLogo.png"}
                      alt="USDC Logo"
                    />
                  </div>
                </div>
                <span className={styles.textContainer}>{"rillaUSDC"}</span>
              </span>
            </button>
          </div>
          <div className={styles.actionButtonSection}>
            {!account ? (
              <ConnectButton />
            ) : (
              <>
                {currentToken.allowance === 0 ||
                currentToken.allowance < Number(delayedInput) ? (
                  <div>
                    <button
                      className={styles.approveOrConnect}
                      onClick={() => approveToken?.()}
                    >
                      Approve {currentToken.symbol}
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className={styles.approveOrConnect}
                      onClick={() => donateTokens?.()}
                    >
                      Donate {currentToken.symbol}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      {open && (
        <TokenSelectModal
          setOpen={setOpen}
          setCurrentToken={setCurrentToken}
          tokenList={tokenList}
        />
      )}
    </>
  );
}

export default Donate;

import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import donationRouter from "../../lib/abis/5/DonationRouter.json";
import { useDelayedInput } from "../../hooks/useDelayedInput";
import Image from "next/image";
import { useNetwork, useAccount } from "wagmi";
import TokenSelectModal from "../../components/TokenSelectModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenList } from "../../hooks/useTokenList";
import { useTokenApprove } from "../../hooks/useTokenApprove";
import { useDonate } from "../../hooks/useDonate";
import Link from "next/link";
import { Snackbar } from "../../components/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

function Donate() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [account, setAccount] = useState("");
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
  const { delayedInput, delayedSetInput } = useDelayedInput("0");
  const [open, setOpen] = useState(false);
  const [donationRouterAddress, setDonationRouterAddress] = useState("");
  const {
    data: approveData,
    isSuccess: approveSuccess,
    write: approveToken,
  } = useTokenApprove(donationRouterAddress, currentToken.address);
  const {
    data: donateData,
    isSuccess: donationSuccess,
    isLoading: donateLoading,
    write: donateTokens,
  } = useDonate(currentToken.address, delayedInput);
  useEffect(() => {
    if (!donateData) return;
    donateOpenSnackbar();
  }, [donateData]);
  useEffect(() => {
    if (!approveData) return;
    donateOpenSnackbar();
  }, [approveData]);

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
        />
      </div>
      <Link href={`https://goerli.etherscan.io/tx/${donateData?.hash}`}>
        <a target="_blank" className={styles.explorerLink}>
          {donateLoading ? "View Transaction Status" : "Transaction Success"}
        </a>
      </Link>
    </div>
  );
  useEffect(() => {
    refetchTokenList();
  }, [approveSuccess, donationSuccess]);

  useEffect(() => {
    if (!chain) return;
    setDonationRouterAddress(donationRouter.address);
  }, [chain]);

  useEffect(() => {
    if (!address) return;
    setAccount(address);
  }, [address]);

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
                      src={
                        Object.keys(currentToken).length == 0
                          ? "/images/unknownToken.jpg"
                          : currentToken.logoURI
                      }
                    />
                  </div>
                </div>
                <span className={styles.textContainer}>
                  {Object.keys(currentToken).length == 0
                    ? ""
                    : currentToken.symbol}
                </span>

                <span className={styles.svgDown}>
                  <Image layout="fill" src="/images/svgs/downCarat.svg" />
                </span>
              </span>
            </button>
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

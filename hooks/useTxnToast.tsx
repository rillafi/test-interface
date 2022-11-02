import { SendTransactionResult, etherscanBlockExplorers } from "@wagmi/core";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, Id } from "react-toastify";
import { useNetwork } from "wagmi";
import styles from "../styles/toastStyles.module.scss";

export function useTxnToast({
  data,
  error,
  isLoading,
  isError,
  isSuccess,
}: {
  data: SendTransactionResult;
  error: Error;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}) {
  const [toastId, setToastId] = useState<Id>();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!data || !isLoading) return;
    const ToastTxnPending = () => {
      return (
        <div className={styles.linkColor}>
          <Link
            href={
              chain?.network == "hardhat"
                ? `${etherscanBlockExplorers.optimism.url}/tx/${data?.hash}`
                : `${etherscanBlockExplorers[chain.network].url}/tx/${data?.hash}`
            }
          >
            <a target="_blank">View Pending Transaction</a>
          </Link>
        </div>
      );
    };
    setToastId(
      toast.loading(<ToastTxnPending />, {
        closeButton: true,
        style: {
          backgroundColor: "#292c4f",
        },
      })
    );
  }, [data, chain, isLoading]);

  useEffect(() => {
    if (!isSuccess || !data) return;
    const ToastTxnSuccess = () => {
      return (
        <div className={styles.linkColor}>
          <Link
            href={
              chain?.network == "hardhat"
                ? `${etherscanBlockExplorers.optimism.url}/tx/${data?.hash}`
                : `${etherscanBlockExplorers[chain.network].url}/tx/${data?.hash}`
            }
          >
            <a target="_blank">Success! View Transaction</a>
          </Link>
        </div>
      );
    };
    const SuccessIcon = () => (
      <div className={styles.icon}>
        <Image layout="fill" src="/images/svgs/check.svg" alt="success icon" />
      </div>
    );
    toast.update(toastId, {
      render: <ToastTxnSuccess />,
      type: "success",
      isLoading: false,
      closeButton: true,
      style: {
        backgroundColor: "#31345e",
      },
      icon: <SuccessIcon />,
      autoClose: 5000,
      progressStyle: { backgroundColor: "#41EAD4" },
    });
  }, [isSuccess, toastId, chain, data]);

  useEffect(() => {
    if (!isError || !toastId) return;
    const ToastTxnError = () => {
      return (
        <div className={styles.errorText}>
          {error?.message ? error.message : "An error occurred"}
        </div>
      );
    };
    toast.update(toastId, {
      render: <ToastTxnError />,
      type: "error",
      isLoading: false,
      closeButton: true,
      style: {
        backgroundColor: "#292c4f",
      },
      autoClose: 5000,
      progressStyle: { backgroundColor: "red" },
    });
  }, [isError, toastId, error]);
}

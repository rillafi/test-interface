import type { NextPage } from "next";
import styles from "./index.module.scss";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useDashboardFetch } from "../hooks/useDashboardFetch";
import { ethers } from "ethers";
import { useClaimTokens } from "../hooks/useClaimTokens";
import { useEffect } from "react";
import { wrapComponent } from "react-snackbar-alert";
import { SnackbarProvider } from "react-simple-snackbar";
import { useSnackbar } from "../hooks/useSnackbar";
import { Snackbar } from "../components/Snackbar";

export default function Home() {
  const {
    data: claimTokensData,
    write: claimTokens,
    isLoading: claimTokensLoading,
    isSuccess: claimTokensSuccess,
  } = useClaimTokens();
  useEffect(() => refetch(), [claimTokensSuccess]);
  const { isActive, openSnackBar } = useSnackbar({ timeout: 10000 });
  useEffect(() => {
    if (!claimTokensData) return;
    openSnackBar();
  }, [claimTokensLoading, claimTokensData]);
  const tasks = [
    "get testnet eth", // address balance > 0
    "Claim testnet rilla", // TokenFetch contract taskClaimedTokens > 0
    "Donate some testnet rilla", // DonationRouter contract taskDonateTRilla
    "Vote in governance on snapshot", // Available after snapshot proposal is done?
  ];
  const bonusTasks = [
    "Donate some testnet rillaUSDC", // DonationRouter contract taskDonatedRillaUSDC
    "Lock tRILLA", // VoteEscrow balanceOf
  ];
  const SnackbarComponent = () => (
    <div className={styles.snackbarContainer}>
      <div className={styles.icon}>
        <Image
          layout="fill"
          src={
            claimTokensLoading
              ? "/images/svgs/spinner.svg"
              : "/images/svgs/checkmark.svg"
          }
        />
      </div>
      <Link href={`https://goerli.etherscan.io/tx/${claimTokensData?.hash}`}>
        <a target="_blank" className={styles.explorerLink}>
          {claimTokensLoading
            ? "View Transaction Status"
            : "Transaction Success"}
        </a>
      </Link>
    </div>
  );
  const { data, refetch } = useDashboardFetch();
  interface TaskList {
    title: string;
    description: string;
    buttonTitle: string;
    linkPath?: string;
    linkPaths?: string[];
    status: boolean;
    onClick?: Function;
  }
  const taskList: TaskList[] = [
    {
      title: "Get Goerli Eth",
      description: "Acquire Goerli Eth from one of the available faucets",
      buttonTitle: "See Faucets",
      linkPath: "/faucets",
      status: data[0],
    },
    {
      title: "Claim Testnet RILLA",
      description: "Claim tokens to participate in testnet activities",
      buttonTitle: "Claim tRILLA",
      status: Number(ethers.utils.formatEther(data[1])) > 0,
      onClick: claimTokens,
    },
    {
      title: "Donate testnet rilla",
      description: "Great things come to those who GIVE. Donate some tRILLA!",
      buttonTitle: "Donate tRILLA",
      linkPath: "/donate",
      status: data[2],
    },
    {
      title: "Vote with tRILLA",
      description: "Don't donate all of your tRILLA - save some for voting!",
      buttonTitle: "Vote on Governance",
      linkPath: "https://demo.snapshot.org/#/rillafi.eth",
      status: false,
    },
  ];
  return (
    <div className={styles.container}>
      <span className={styles.title}>RillaFi Testnet Tasks</span>
      <div className={styles.checklist}>
        {taskList.map((task) => (
          <>
            <div className={styles.lineBreak} />
            <div className={styles.taskGrid} key={task.title}>
              <div className={styles.taskStatus}>
                {task.status ? (
                  <Image layout="fill" src="/images/svgs/checkmark.svg" />
                ) : (
                  <Image layout="fill" src="/images/svgs/circleOutline2.svg" />
                )}
              </div>
              <div
                className={styles.task}
                style={{ opacity: task.status ? 0.5 : 1 }}
              >
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskDescription}>{task.description}</div>
                {task.linkPath ? (
                  <Link href={task.linkPath}>
                    <a
                      target={
                        task.linkPath.charAt(0) == "/" ? "_self" : "_blank"
                      }
                    >
                      <button
                        className={styles.taskButton}
                        disabled={task.status}
                      >
                        {task.buttonTitle}
                      </button>
                    </a>
                  </Link>
                ) : (
                  <button
                    className={styles.taskButton}
                    disabled={task.status}
                    onClick={async () => {
                      task.onClick?.();
                    }}
                  >
                    {task.buttonTitle}
                  </button>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
      <Snackbar isActive={isActive} Content={SnackbarComponent} />
    </div>
  );
}

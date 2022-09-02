import styles from "./index.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useDashboardFetch } from "../hooks/useDashboardFetch";
import { ethers } from "ethers";
import { useClaimTokens } from "../hooks/useClaimTokens";
import { useEffect } from "react";
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
    "Claim tRILLA", // TokenFetch contract taskClaimedTokens > 0
    "Donate tRILLA", // DonationRouter contract taskDonateTRilla
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
      buttonTitle: "SEE FAUCETS",
      linkPath: "/faucets",
      status: data[0],
    },
    {
      title: "Claim tRILLA",
      description: "Claim tokens to participate in testnet activities",
      buttonTitle: "CLAIM tRILLA",
      status: Number(ethers.utils.formatEther(data[1])) > 0,
      onClick: claimTokens,
    },
    {
      title: "Donate tRILLA",
      description: "Great things come to those who GIVE. Donate some tRILLA!",
      buttonTitle: "DONATE tRILLA",
      linkPath: "/donate",
      status: data[2],
    },
    {
      title: "Vote with tRILLA",
      description:
        "Don't donate all of your tRILLA - save some for voting! Check back tomorrow for a proposal that will affect the real world RILLA DAO.",
      buttonTitle: "VOTE ON GOVERNANCE",
      linkPath: "https://demo.snapshot.org/#/rillafi.eth",
      status: false,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <span className={styles.title}>RillaFi Testnet Tasks</span>
        <span className={styles.description}>
          Welcome to the RillaFi testnet! Thanks for helping us build the next
          generation of web3 philanthropic tools. This testnet helps us gather
          data to optimize RillaFi and gather potential users. We have a few
          tasks for you to complete while you are here. See below!{" "}
        </span>
        <div className={styles.flexTaskBox}>
          {taskList.map((task) => (
            <div
              className={styles.taskFlexBox}
              key={task.title}
              style={task.status ? { opacity: "0.5" } : {}}
            >
              {/* <div className={styles.lineBreak} /> */}
              {/* <div className={styles.taskGrid} key={task.title}> */}
              <div className={styles.taskActionBox}>
                <div className={styles.taskStatus}>
                  {task.status ? (
                    <Image layout="fill" src="/images/svgs/check.svg" />
                  ) : (
                    <Image layout="fill" src="/images/svgs/unchecked.svg" />
                  )}
                </div>
                <div
                  className={styles.taskTitle}
                  // style={task.status ? { opacity: "0.5" } : {}}
                >
                  {task.title}
                </div>
              </div>
              <div className={styles.taskDescription}>{task.description}</div>
              {task.linkPath ? (
                <Link href={task.linkPath}>
                  <a
                    target={task.linkPath.charAt(0) == "/" ? "_self" : "_blank"}
                  >
                    <button
                      className={styles.taskButton}
                      disabled={task.status}
                    >
                      <div className={styles.buttonText}>
                        {task.buttonTitle}
                      </div>
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
                  <div className={styles.buttonText}>{task.buttonTitle}</div>
                </button>
              )}
            </div>
            // </div>
          ))}
        </div>
      </div>
      <Snackbar isActive={isActive} Content={SnackbarComponent} />
    </div>
  );
}

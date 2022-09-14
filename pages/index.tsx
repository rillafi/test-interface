import styles from "./index.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useDashboardFetch } from "../hooks/useDashboardFetch";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useRillaContractWrite } from "../hooks/useRillaContractWrite";

export default function Home() {
  const {
    data: claimTokensData,
    write: claimTokens,
    isLoading: claimTokensLoading,
    isSuccess: claimTokensSuccess,
  } = useRillaContractWrite("TokenClaim", "claimTokens");
  const tasks = [
    "get testnet eth", // address balance > 0
    "Claim tRILLA", // TokenFetch contract taskClaimedTokens > 0
    "Donate tRILLA", // DonationRouter contract taskDonateTRilla
    "Vote in governance on snapshot", // Available after snapshot proposal is done?
  ];

  const { data, refetch } = useDashboardFetch();
  useEffect(() => refetch(), [claimTokensSuccess, refetch]);
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
      status: Boolean(data[0]),
    },
    {
      title: "Claim tRILLA",
      description: "Claim tokens to participate in testnet activities",
      buttonTitle: "CLAIM tRILLA",
      status:
        Number(ethers.utils.formatEther(data[1] as ethers.utils.Result)) > 0,
      onClick: claimTokens,
    },
    {
      title: "Donate tRILLA",
      description: "Great things come to those who GIVE. Donate some tRILLA!",
      buttonTitle: "DONATE tRILLA",
      linkPath: "/donate",
      status: Boolean(data[2]),
    },
    {
      title: "Vote with tRILLA",
      description:
        "The snapshot for proposal 1 was taken Sep 13, 2022, 2:31 PM. Save your tRILLA still - another snapshot will be taken on Thursday evening with another proposal to go live.",
      buttonTitle: "VOTE ON GOVERNANCE",
      linkPath: "https://demo.snapshot.org/#/rillafi.eth",
      status: false,
    },
    // {
    //   title: "Read RillaFi Whitepaper",
    //   description:
    //     "Check out our whitepaper to understand our protocol, our mission, and how you can get involved!",
    //   buttonTitle: "READ WHITEPAPER",
    //   linkPath: "https://rillafi.gitbook.io/rillafi-docs-and-support/",
    //   status: false,
    // },
    // {
    //   title: "Take RillaFi Quiz",
    //   description:
    //     "Now that you know everything about RillaFi, put that knowledge to the test!",
    //   buttonTitle: "TAKE QUIZ",
    //   linkPath: "https://rillafi.gitbook.io/rillafi-docs-and-support/",
    //   status: false,
    // },
  ];
  useEffect(() => {
    const bonusTasks = [
      "Donate some testnet rillaUSDC", // DonationRouter contract taskDonatedRillaUSDC
      "Lock tRILLA", // VoteEscrow balanceOf
    ];
    const logTasks = () => console.log(bonusTasks);
    const interval = setInterval(logTasks, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
            <React.Fragment key={task.title}>
              <div
                className={styles.taskFlexBox}
                style={task.status ? { opacity: "0.5" } : {}}
              >
                <div className={styles.taskActionBox}>
                  <div className={styles.taskStatus}>
                    {task.status ? (
                      <Image
                        layout="fill"
                        src="/images/svgs/check.svg"
                        alt="checkmark"
                      />
                    ) : (
                      <Image
                        layout="fill"
                        src="/images/svgs/unchecked.svg"
                        alt="no checkmark"
                      />
                    )}
                  </div>
                  <div className={styles.taskTitle}>{task.title}</div>
                </div>
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
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

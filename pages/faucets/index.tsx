import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

export default function faucets() {
  const faucets = [
    {
      title: "Goerli Mining Faucet",
      description: "Requirements: None, other than a little computing power",
      path: "https://goerli-faucet.pk910.de/",
    },
    {
      title: "Alchemy Goerli Faucet",
      description: "Requirements: Sign up for an Alchemy account",
      path: "https://goerlifaucet.com/",
    },
    {
      title: "Paradigm Faucet",
      description: "Requirements: Sign in with your twitter account",
      path: "https://faucet.paradigm.xyz/",
    },
    {
      title: "@Mudit__Gupta Faucet",
      description: "Requirements: Post a tweet containing your eth address",
      path: "https://goerli-faucet.mudit.blog/",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <span className={styles.title}>Goerli Testnet Faucets</span>
        <span className={styles.description}>
          Use a faucet to acquire Goerli Eth for transactions. It is not worth
          anything, which is why you cannot purchase it. However, it can be
          mined or requested from any of these 3rd party sources below.
        </span>
        <div className={styles.flexTaskBox}>
          {faucets.map((faucet, i) => (
            <div className={styles.taskFlexBox} key={faucet.path}>
              <div className={styles.taskActionBox}>
                <div className={styles.taskTitle}>{faucet.title}</div>
              </div>
              <div className={styles.taskDescription}>{faucet.description}</div>
              <Link href={faucet.path}>
                <a target="_blank">
                  <button className={styles.taskButton}>
                    <div className={styles.buttonText}>FAUCET {i + 1}</div>
                  </button>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

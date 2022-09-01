import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

export default function faucets() {
  const linkPaths = [
    {
      title: "Goerli Mining Faucet",
      description: "Requirements: None, other than a little computing power",
      path: "https://goerli-faucet.pk910.de/",
    },
    {
      title: "Alchemy Goerli Faucet",
      description: "Requirements: Sign up for Alchemy account",
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
      <span className={styles.title}>
        Goerli Faucets (ranked from easiest to hardest)
      </span>
      <div className={styles.columnContainer}>
        {linkPaths.map((link) => (
          <div className={styles.rowContainer} key={link.path}>
            <Link href={link.path}>
              <a target="_blank" className={styles.faucetTitle}>
                <span className={styles.text}> {link.title}</span>
                <div className={styles.image}>
                  <Image layout="fill" src="/images/svgs/link.svg" />
                </div>
              </a>
            </Link>
            <span className={styles.description}>{link.description} </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";
import rillaFiLogo from "../../public/images/svgs/rillaFiLogo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useMediaQuery from "../../hooks/useMediaQuery";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Sling as Hamburger } from "hamburger-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 600px)");
  const navInfo = [
    { path: "/", name: "Dashboard" },
    { path: "/faucets", name: "Faucets" },
    { path: "/donate", name: "Donate" },
    { path: "https://demo.snapshot.org/#/rillafi.eth", name: "Governance" },
  ];

  return (
    <nav id="navbar">
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Image src={rillaFiLogo} layout="responsive" alt="RillaFi Logo" />
        </div>
        {isDesktop ? (
          <div className={styles.desktopMenu}>
            <div className={styles.menuList}>
              {navInfo.map((link) => (
                <Link href={link.path} key={link.path}>
                  <a
                    className={`${styles.navLink} ${
                      router.pathname === link.path && styles.navLinkFocused
                    }`}
                    target={link.path.charAt(0) === "/" ? "_self" : "_target"}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
              <ConnectButton accountStatus={"address"} />
            </div>
          </div>
        ) : (
          <Hamburger toggled={open} toggle={setOpen} color="#ffffff" />
        )}
      </div>
      {!isDesktop && (
        <div
          className={
            !open
              ? styles.mobileNavWrapper
              : `${styles.mobileNavWrapper} ${styles.mobileNavWrapperOpen}`
          }
        >
          {navInfo.map((link) => (
            <Link href={link.path} key={link.path}>
              <a
                className={`${styles.mobileLink} ${
                  router.pathname === link.path && styles.navLinkFocused
                }`}
                onClick={() => setOpen(!open)}
              >
                {link.name}
              </a>
            </Link>
          ))}
          <div className={styles.connectButton}>
            <ConnectButton accountStatus={"address"} />
          </div>
        </div>
      )}
    </nav>
  );
}

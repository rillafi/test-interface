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
  const active = classNames(styles.mobileMenu, { open });
  const displayMobileNavLinks = classNames(styles.mobileNavWrapper, {
    open: open,
  });
  const navInfo = [
    { path: "/", name: "Dashboard" },
    { path: "/faucets", name: "Faucets" },
    { path: "/donate", name: "Donate" },
    { path: "https://demo.snapshot.org/#/rillafi.eth", name: "Governance" },
  ];

  useEffect(() => console.log(displayMobileNavLinks), [displayMobileNavLinks]);
  return (
    <nav id="navbar">
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Image src={rillaFiLogo} layout="responsive" />
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
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
              <div className={styles.connectButton}>
                <ConnectButton accountStatus={"address"} />
              </div>
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

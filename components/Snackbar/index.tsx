import { NextComponentType } from "next";
import styles from "./index.module.scss";

export function Snackbar({
  isActive,
  Content,
}: {
  isActive: boolean;
  Content: NextComponentType;
}) {
  return (
    <div
      className={
        isActive
          ? [styles.snackbar, styles.fadeIn].join(" ")
          : [styles.snackbar, styles.fadeOut].join(" ")
      }
    >
      <Content />
    </div>
  );
}

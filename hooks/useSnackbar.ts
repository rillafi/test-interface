import React from "react";

export function useSnackbar({ timeout }: { timeout: number }) {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (isActive === true) {
      setTimeout(() => {
        setIsActive(false);
      }, timeout);
    }
  }, [isActive]);

  const openSnackBar = () => {
    setIsActive(true);
  };

  return { isActive, openSnackBar };
}

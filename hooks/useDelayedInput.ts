import { useState } from "react";

export function useDelayedInput(init) {
  const [timer, setTimer] = useState(null);
  const [delayedInput, setDelayedInput] = useState(init);
  function delayedSetInput(change) {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setDelayedInput(change);
      }, 500)
    );
  }

  return { delayedInput, delayedSetInput };
}

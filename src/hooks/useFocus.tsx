import { useRef, type MutableRefObject } from "react";

export const useButtonFocus = (): [
  MutableRefObject<HTMLButtonElement | null>,
  () => void
] => {
  const htmlElRef = useRef<HTMLButtonElement | null>(null);
  const setFocus = (): void => {
    htmlElRef.current?.focus();
  };

  return [htmlElRef, setFocus];
};

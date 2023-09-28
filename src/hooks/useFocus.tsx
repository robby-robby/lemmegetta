import { useRef, MutableRefObject } from "react";

export const useFocus = (): [
  MutableRefObject<HTMLInputElement | null>,
  () => void
] => {
  const htmlElRef = useRef<HTMLInputElement | null>(null);
  const setFocus = (): void => {
    htmlElRef.current?.focus();
  };

  return [htmlElRef, setFocus];
};

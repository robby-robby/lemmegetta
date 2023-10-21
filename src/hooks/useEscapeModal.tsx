import { useEffect } from "react";

export function useEscapeModal(...modalClosers: (() => void)[]) {
  return useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        modalClosers.forEach((fn) => {
          try {
            fn();
          } catch (e) {
            console.error(e);
          }
        });
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalClosers]);
}

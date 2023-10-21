import React, { MutableRefObject, useEffect } from "react";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useButtonFocus } from "~/hooks/useFocus";
import { Spinner } from "~/components/Spinner";
import { TRPCStatus } from "../utils/TRPCStatus";

export const ConfirmState = {
  open: true,
  close: false,
};
export type ConfirmState = (typeof ConfirmState)[keyof typeof ConfirmState];

// export type SaveStatusType = (typeof TRPCStatus)[keyof typeof TRPCStatus];

export const useConfirmModal = <T,>(): {
  open: (cf: T) => void;
  close: () => void;
  state: ConfirmState;
  confirmFor: T;
  setConfirmFor: (cf: T) => void;
  message: string;
  setMessage: (message: string) => void;
  reset: () => void;
  setState: (state: ConfirmState) => void;
} => {
  const [state, setState] = useState<ConfirmState>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmFor, setConfirmFor] = useState<T>(null as unknown as T);
  const reset = () => {
    setMessage("");
  };
  const close = () => {
    setState(ConfirmState.close);
  };
  const open = (cf: T) => {
    setConfirmFor(cf);
    setState(ConfirmState.open);
  };
  useEffect(() => {
    if (state == ConfirmState.close) reset();
  }, [state]);

  return {
    open,
    close,
    reset,
    state,
    message,
    setMessage,
    setState,
    confirmFor,
    setConfirmFor,
  };
};

type Props = {
  state: ConfirmState;
  ok: () => void;
  cancel?: () => void;
  close?: () => void;
  message?: string;
};

export function OkCancelModal({ state, cancel, close, message, ok }: Props) {
  const [inputRef, setInputFocus] = useButtonFocus();
  useEffect(() => setInputFocus(), [setInputFocus]);
  return (
    <div className={`${state === ConfirmState.open ? "" : "hidden"}`}>
      <div
        tabIndex={-1}
        className="fixed left-0 right-0 top-0 z-50 flex h-full max-h-full justify-center overflow-y-auto overflow-x-hidden bg-slate-500/75 p-4 align-middle md:inset-0"
      >
        <div className="relative max-h-full w-full max-w-md">
          <div className="relative rounded-lg bg-white shadow">
            <button
              onClick={() => {
                if (typeof cancel === "function") cancel();
                if (typeof close === "function") close();
              }}
              type="button"
              className="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-slate-400 hover:bg-slate-200"
              data-modal-hide="popup-modal"
            >
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <div className="text-6xl">🔮</div>
              {message ? (
                <pre className="m-5 whitespace-break-spaces text-sm text-slate-500">
                  {message}
                </pre>
              ) : null}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof cancel === "function") cancel();
                    if (typeof close === "function") close();
                  }}
                  ref={inputRef}
                  className="mr-2 rounded bg-slate-400 px-4 py-2 font-bold text-white hover:bg-slate-500"
                >
                  ❌ Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof ok === "function") ok();
                    if (typeof close === "function") close();
                  }}
                  className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Ok 👍
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export const OkCancelModal: React.FC<Props> = ({
//   state,
//   ok,
//   close,
//   cancel,
//   message,
// }) => {
//   return (
//     <RawOkCancelModal
//       state={state}
//       cancel={cancel}
//       close={close}
//       message={message}
//       ok={ok}
//       // inputRef={inputRef}
//     />
//   );
// };

import React, { MutableRefObject, useEffect } from "react";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useButtonFocus } from "~/hooks/useFocus";
import { Spinner } from "./Spinner";
import { TRPCStatus } from "../utils/TRPCStatus";

export const SaveState = {
  open: true,
  close: false,
};
export type SaveStates = (typeof SaveState)[keyof typeof SaveState];

export type SaveStatusType = (typeof TRPCStatus)[keyof typeof TRPCStatus];

const AlertIcon = () => (
  <div className="flex justify-center">
    <FiAlertTriangle color="red" size={50} />
  </div>
);

const CheckIcon = () => (
  <div className="flex justify-center">
    <BsCheckCircle color="green" size={50} />
  </div>
);

/**
 * Hook to manage the state of the save modal
 * @returns {object} - An object containing the open, close, state, and setState functions
 * @note - status and onStatusChange are optional, as they may not be needed in all cases
 * Can be used for multiple statuses. For a single mutation, a simple trpc mutation status
 * may be sufficient.
 **/

export const useSaveModal = (): {
  open: () => void;
  close: () => void;
  state: SaveStates;
  message: string;
  setMessage: (message: string) => void;
  status: SaveStatusType;
  setStatus: (status: SaveStatusType) => void;
  reset: () => void;
  setState: (state: SaveStates) => void;
} => {
  const [state, setState] = useState<SaveStates>(false);
  const [status, setStatus] = useState<SaveStatusType>(TRPCStatus.idle);
  const [message, setMessage] = useState<string>("");
  const reset = () => {
    setMessage("");
    setStatus(TRPCStatus.idle);
  };
  const close = () => {
    setState(SaveState.close);
  };
  const open = () => {
    setState(SaveState.open);
  };
  useEffect(() => {
    if (state == SaveState.close) reset();
  }, [state]);

  return {
    open,
    close,
    reset,
    state,
    message,
    setMessage,
    setState,
    status,
    setStatus,
  };
};

type Props = {
  stickyOpen?: boolean;
  status: SaveStatusType;
  state: SaveStates;
  close: () => void;

  message?: string;
};

export const SaveModal: React.FC<Props> = ({
  state,
  close,
  status,
  stickyOpen = true,
  message,
}) => {
  const color = status === TRPCStatus.success ? "green" : "red";
  const [inputRef, setInputFocus] = useButtonFocus();
  const onClose = () => {
    if (status !== TRPCStatus.loading || !stickyOpen) {
      close();
    }
    // setMessage("");
  };
  useEffect(() => {
    if (status !== TRPCStatus.loading) {
      setInputFocus();
    }
  }, [status]);
  return (
    <div className={`${state === SaveState.open ? "" : "hidden"}`}>
      <div
        tabIndex={-1}
        className="fixed left-0 right-0 top-0 z-50 flex h-full max-h-full justify-center overflow-y-auto overflow-x-hidden bg-gray-500/75 p-4 align-middle md:inset-0"
      >
        <div className="relative max-h-full w-full max-w-md">
          <div className="relative rounded-lg bg-white shadow">
            <button
              onClick={onClose}
              type="button"
              className="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200"
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
              {status === TRPCStatus.success ? <CheckIcon /> : null}
              {status === TRPCStatus.error ? <AlertIcon /> : null}
              {status === TRPCStatus.loading ? <Spinner /> : null}
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                {status === TRPCStatus.success ? "Changes Saved" : null}
                {status === TRPCStatus.error ? "Error updating :(" : null}
                {status === TRPCStatus.loading ? "Loading..." : null}
              </h3>
              {message ? (
                <pre className="m-10 text-sm text-gray-500">{message}</pre>
              ) : null}
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={onClose}
                ref={inputRef}
                disabled={status === TRPCStatus.loading}
                className={`rounded-lg border border-${color}-500 bg-${color}-500 px-5 py-2.5 text-sm font-medium text-white
  hover:bg-${color}-600 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-${color}-500 disabled:border-none disabled:bg-gray-400`}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef } from "react";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useEscapeModal } from "~/hooks/useEscapeModal";
import { useFocus } from "~/hooks/useFocus";
import { Spinner } from "./Spinner";

export const SaveStatus = Object.freeze({
  loading: "loading",
  success: "success",
  error: "error",
  idle: "idle",
});

export const SaveState = {
  open: true,
  close: false,
};
export type SaveStates = (typeof SaveState)[keyof typeof SaveState];

export type SaveStatusType = (typeof SaveStatus)[keyof typeof SaveStatus];

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
  status: SaveStatusType;
  onStatusChange: (status: SaveStatusType) => void;
  setState: (state: SaveStates) => void;
} => {
  const [state, setState] = useState<SaveStates>(false);
  const [status, onStatusChange] = useState<SaveStatusType>(SaveStatus.idle);
  const close = () => {
    setState(SaveState.close);
  };
  const open = () => {
    setState(SaveState.open);
  };

  return { open, close, state, setState, status, onStatusChange };
};

type Props = {
  stickyOpen?: boolean;
  status: SaveStatusType;
  state: SaveStates;
  close: () => void;
};

export const SaveModal: React.FC<Props> = ({
  state,
  close,
  status,
  stickyOpen = true,
}) => {
  const color = status === SaveStatus.success ? "green" : "red";
  const [inputRef, setInputFocus] = useFocus();
  const onClose = () => {
    if (status !== SaveStatus.loading || !stickyOpen) {
      close();
    }
  };
  useEffect(() => {
    if (status !== SaveStatus.loading) {
      setInputFocus();
    }
  }, [status]);
  return (
    <div className={`${state === SaveState.open ? "" : "hidden"}`}>
      <div
        id="popup-modal"
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
              {status === SaveStatus.success ? <CheckIcon /> : null}
              {status === SaveStatus.error ? <AlertIcon /> : null}
              {status === SaveStatus.loading ? <Spinner /> : null}
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                {status === SaveStatus.success ? "Changes Saved" : null}
                {status === SaveStatus.error ? "Error updating :(" : null}
                {status === SaveStatus.loading ? "Loading..." : null}
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={onClose}
                ref={inputRef}
                disabled={status === SaveStatus.loading}
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

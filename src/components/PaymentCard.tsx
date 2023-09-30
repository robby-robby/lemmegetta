import React from "react";
import { type PaymentCardInfo, type PaymentCards } from "~/models/cards";

export type PaymentPropSetter = <
  T extends keyof PaymentCards,
  U extends keyof PaymentCardInfo
>(
  type: T,
  property: U,
  value: PaymentCardInfo[U]
) => void;
type PaymentCardProps = {
  paymentType: keyof PaymentCards;
  isEnabled: boolean;
  username: string;
  urlTemplate: string;
  reset: () => void;
  setProperty: PaymentPropSetter;
};

export const PaymentCard: React.FC<PaymentCardProps> = ({
  reset,
  paymentType,
  isEnabled,
  username,
  urlTemplate,
  setProperty,
}) => {
  return (
    <>
      <div className="relative mb-4 w-full rounded-lg bg-slate-100 p-4">
        <h3 className="text-lg font-bold">{paymentType}</h3>
        <div className="mt-4">
          <label className="mb-1 text-sm text-gray-900">
            Username
            <input
              type="text"
              name="username"
              className="w-full rounded border border-black  p-2"
              value={username}
              onChange={(e) =>
                setProperty(paymentType, "username", e.target.value)
              }
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="mb-1 text-sm text-gray-900">
            URL Template
            <input
              type="text"
              name="urlTemplate"
              className="w-full rounded border border-black p-2"
              value={urlTemplate}
              onChange={(e) =>
                setProperty(paymentType, "urlTemplate", e.target.value)
              }
            />
          </label>
        </div>

        <div className="mt-4">
          <input
            type="checkbox"
            name="isEnabled"
            className="h-4 w-4 rounded border-black text-blue-600 focus:ring-blue-500"
            checked={isEnabled}
            onChange={(e) =>
              setProperty(paymentType, "isEnabled", e.target.checked)
            }
            id={`isEnabled${paymentType}`}
          />
          <label
            className="ml-2 text-sm text-gray-900"
            htmlFor={`isEnabled${paymentType}`}
          >
            Enabled
          </label>
        </div>
        <div className="flex justify-end">
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            Test
          </button>
          <button
            onClick={reset}
            className="ml-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

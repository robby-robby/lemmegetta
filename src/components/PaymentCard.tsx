import React from "react";
import { VxErrorsType } from "~/hooks/useVxErrors";
import {
  PaymentMutateProps,
  type PaymentCardInfo,
  type PaymentCards,
} from "~/models/cards";
import { FormFieldErrorsObject } from "~/utils/misc";

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
  vxErrors?: FormFieldErrorsObject<PaymentMutateProps>;
};

export const PaymentCard: React.FC<PaymentCardProps> = ({
  reset,
  paymentType,
  isEnabled,
  username,
  urlTemplate,
  setProperty,
  vxErrors,
}) => {
  const { fieldErrors, formErrors } = vxErrors ?? {};
  return (
    <>
      <div className="relative mb-4 w-full rounded-lg bg-slate-100 p-4">
        <h3 className="text-lg font-bold">{paymentType}</h3>
        <div className="mt-4">
          <label className="mb-1 text-sm text-slate-900">
            Username
            <input
              type="text"
              name="username"
              className={`w-full rounded border border-black p-2 ${
                fieldErrors?.username ? "border-red-500" : ""
              }`}
              value={username}
              onChange={(e) =>
                setProperty(paymentType, "username", e.target.value)
              }
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="mb-1 text-sm text-slate-900">
            URL Template
            <input
              type="text"
              name="urlTemplate"
              className={`w-full rounded border border-black p-2 ${
                fieldErrors?.urlTemplate ? "border-red-500" : ""
              }`}
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
            className={`h-4 w-4 rounded border-black text-indigo-600 focus:ring-indigo-500 ${
              fieldErrors?.urlTemplate ? "border-red-500" : ""
            }`}
            checked={isEnabled}
            onChange={(e) =>
              setProperty(paymentType, "isEnabled", e.target.checked)
            }
            id={`isEnabled${paymentType}`}
          />
          <label
            className="ml-2 text-sm text-slate-900"
            htmlFor={`isEnabled${paymentType}`}
          >
            Enabled
          </label>
        </div>

        {formErrors && formErrors.length > 0 && (
          <div className="mb-4">
            {formErrors?.map((error, index) => (
              <p key={index} className="mt-1 text-xs text-pink-500">
                {error}
              </p>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <button className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100">
            Test
          </button>
          <button
            onClick={reset}
            className="ml-4 rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

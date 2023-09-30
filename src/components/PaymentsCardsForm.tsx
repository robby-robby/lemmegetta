import React from "react";
import {
  PaymentErrorsFormat,
  // type PaymentMutateProps,
  type PaymentCards,
  type PaymentErrorsFlat,
} from "~/models/cards";
// import { type PropSetter } from "~/pages/admin/PropSetter";
import { PaymentCard, type PaymentPropSetter } from "./PaymentCard";

export function PaymentsCardsForm({
  handleSubmit,
  setProperty,
  reset,
  cards,
  vxErrorsFormat,
}: {
  cards: PaymentCards;
  reset: (card: keyof PaymentCards) => void;
  setProperty: PaymentPropSetter;
  handleSubmit: () => void;
  vxErrorsFormat?: PaymentErrorsFormat;
}) {
  return (
    <div className="space-y-4">
      <PaymentCard
        reset={() => reset("CashApp")}
        paymentType="CashApp"
        isEnabled={cards.CashApp.isEnabled}
        username={cards.CashApp.username}
        urlTemplate={cards.CashApp.urlTemplate}
        setProperty={setProperty}
        vxErrorsFormat={vxErrorsFormat}
      />
      <PaymentCard
        reset={() => reset("Venmo")}
        paymentType="Venmo"
        isEnabled={cards.Venmo.isEnabled}
        username={cards.Venmo.username}
        urlTemplate={cards.Venmo.urlTemplate}
        setProperty={setProperty}
        vxErrorsFormat={vxErrorsFormat}
      />

      <div className="relative mb-4 w-full rounded-lg bg-slate-100 p-4">
        <h3 className="text-lg font-bold">Cash</h3>
        <div className="mt-4">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            checked={cards.Cash.isEnabled}
            id="isEnabledCash"
            onChange={(e) => setProperty("Cash", "isEnabled", e.target.checked)}
          />
          <label
            htmlFor="isEnabledCash"
            className="ml-2 text-sm text-slate-900"
          >
            Enabled
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          type="button"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

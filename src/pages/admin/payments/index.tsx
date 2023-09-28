/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type ReactElement } from "react";

import AdminLayout from "~/components/AdminLayout";
import { SaveModal, useSaveModal } from "~/components/SaveModal";
// import { useEscapeModal } from "~/hooks/useEscapeModal";
import { PaymentsCardsForm } from "~/components/PaymentsCardsForm";
import { usePaymentCardsRPC } from "~/models/cards/usePaymentCardsRPC";

export default function Payments() {
  const {
    open: saveModalOpen,
    close: saveModalClose,
    state: saveModalState,
  } = useSaveModal();

  // useEscapeModal(saveModalClose);

  const {
    cards,
    setProperty,
    reset,
    update: handleSubmit,
    paymentsMuUpdate: paymentsMutation,
  } = usePaymentCardsRPC({
    onSubmit: saveModalOpen,
  });

  return (
    <>
      <SaveModal
        state={saveModalState}
        close={saveModalClose}
        status={paymentsMutation.status}
      />
      <div className="min-h-screen items-center justify-center bg-gray-100">
        <h1 className="mb-4 pt-4 text-center text-3xl font-bold">
          Payment Settings
        </h1>
        <div className="flex items-start justify-center bg-gray-100">
          <div className="m-4 w-full max-w-lg rounded-lg bg-white shadow-md sm:p-3 ">
            <PaymentsCardsForm
              reset={reset}
              handleSubmit={handleSubmit}
              cards={cards}
              setProperty={setProperty}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Payments.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

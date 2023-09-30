/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type ReactElement } from "react";

import AdminLayout from "~/components/AdminLayout";
import { SaveModal, useSaveModal } from "~/components/SaveModal";
import { PaymentsCardsForm } from "~/components/PaymentsCardsForm";
import { usePaymentCardsRPC } from "~/models/cards/usePaymentCardsRPC";
import { isValidationFormatError } from "~/utils/misc";
import { useVxFormatErrors } from "~/hooks/useVxErrors";
import { type PaymentCardsType } from "~/models/cards";

export default function Payments() {
  const {
    success: saveModalSuccess,
    error: saveModalError,
    loading: saveModalLoading,
    close: saveModalClose,
    message: saveModalMessage,
    state: saveModalState,
    status: saveModalStatus,
    toughError: saveModalToughError,
  } = useSaveModal();

  const { cards, setProperty, reset, updateAsync } = usePaymentCardsRPC();

  const { vxFormatErrors, vxFormatErrorsSet, vxFormatErrorsReset } =
    useVxFormatErrors<PaymentCardsType>();

  const handleSubmit = async () => {
    try {
      vxFormatErrorsReset();
      saveModalLoading("...");
      await updateAsync(cards);
      saveModalSuccess("Payment settings updated");
    } catch (error) {
      if (isValidationFormatError<PaymentCardsType>(error)) {
        saveModalClose();
        return vxFormatErrorsSet(error.data.validationFormattedError);
      } else {
        saveModalToughError(null, "Something went wrong");
      }
    }
  };

  return (
    <>
      <SaveModal
        state={saveModalState}
        close={saveModalClose}
        message={saveModalMessage}
        status={saveModalStatus}
      />
      <div className="min-h-screen items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-center text-3xl uppercase text-slate-800 ">
          Payment Settings
        </h1>
        <div className="flex items-start justify-center bg-gray-100">
          <div className="m-4 w-full max-w-lg rounded-lg bg-white shadow-md sm:p-3 ">
            <PaymentsCardsForm
              reset={reset}
              vxErrorsFormat={vxFormatErrors}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

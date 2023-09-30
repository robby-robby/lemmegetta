import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { type PaymentCards, PaymentCardsDefault } from "~/models/cards";
import { type SaveStatusType } from "~/components/SaveModal";
import { TRPCStatus } from "~/utils/TRPCStatus";
import { type PaymentPropSetter } from "~/components/PaymentCard";

export function usePaymentCardsRPC(
  onStatusChange?: (status: SaveStatusType) => void
) {
  const [cards, setCards] = React.useState<PaymentCards>({
    ...PaymentCardsDefault,
  });

  const setProperty: PaymentPropSetter = (type, property, value) => {
    setCards((prevCards) => ({
      ...prevCards,
      [type]: { ...prevCards[type], [property]: value },
    }));
  };
  const reset = (type: keyof PaymentCards): void => {
    setCards((prevCards) => ({
      ...prevCards,
      [type]: { ...PaymentCardsDefault[type] },
    }));
  };
  const paymentsMuUpdate = api.paymentSettings.update.useMutation();
  const paymentsQuery = api.paymentSettings.getAll.useQuery();
  const update = () => {
    paymentsMuUpdate.mutate(cards);
  };

  useEffect(() => {
    if (paymentsQuery.status === TRPCStatus.success) {
      if (paymentsQuery.data !== undefined) setCards(paymentsQuery.data);
    }
  }, [paymentsQuery.data, paymentsQuery.status]);

  useEffect(() => {
    if (paymentsMuUpdate.status !== "idle") {
      if (onStatusChange) onStatusChange(paymentsMuUpdate.status);
    }
  }, [paymentsMuUpdate.status]);

  return {
    cards,
    setProperty,
    reset,
    update,
    updateAsync: paymentsMuUpdate.mutateAsync,
    paymentsMuUpdate,
  };
}

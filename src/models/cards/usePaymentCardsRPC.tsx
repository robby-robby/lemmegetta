import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { type PaymentCards, PaymentCardsDefault } from "~/models/cards";
import { type SaveStatusType } from "~/components/SaveModal";
import { type PaymentPropSetter } from "~/components/PaymentCard";

export function usePaymentCardsRPC({
  onSubmit,
  onStatusChange,
}: {
  onSubmit?: (pc?: PaymentCards) => void;
  onStatusChange?: (status: SaveStatusType) => void;
} = {}) {
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
    if (onSubmit) onSubmit(cards);
  };

  useEffect(() => {
    if (paymentsQuery.status === "success") {
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
    paymentsMuUpdate,
  };
}

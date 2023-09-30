import { useState } from "react";
import { type FormFieldErrorsObject } from "~/utils/misc";

// export type VxErrorsType = FormFieldErrorsObject;
export function useVxErrors<T>() {
  const [vxErrors, vxErrorsSet] = useState<FormFieldErrorsObject<T>>({
    formErrors: [],
    fieldErrors: {} as Record<keyof T, string[]>,
  });
  const vxErrorsReset = () =>
    vxErrorsSet({
      formErrors: [],
      fieldErrors: {} as Record<keyof T, string[]>,
    });

  return {
    vxErrors: vxErrors,
    vxErrorsSet: vxErrorsSet,
    vxErrorsReset: vxErrorsReset,
  };
}

// fieldErrors: {} as Record<keyof T, string[]> & object,

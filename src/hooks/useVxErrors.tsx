import { useState } from "react";
import { z } from "zod";
import { type FormFieldErrorsObject } from "~/utils/misc";

// export type VxErrorsType = FormFieldErrorsObject;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function useVxErrors<T>() {
//   const [vxErrors, vxErrorsSet] = useState<T>({
//     formErrors: [],
//     fieldErrors: {},
//   } as T);
//   const vxErrorsReset = () =>
//     vxErrorsSet({
//       formErrors: [],
//       fieldErrors: {},
//     } as T);

//   return {
//     vxErrors: vxErrors,
//     vxErrorsSet: vxErrorsSet,
//     vxErrorsReset: vxErrorsReset,
//   };
// }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useVxErrors<T extends z.ZodType<any, any, any>>() {
  const [vxErrors, vxErrorsSet] = useState<z.inferFlattenedErrors<T>>({
    formErrors: [],
    fieldErrors: {},
  });
  const vxErrorsReset = () =>
    vxErrorsSet({
      formErrors: [],
      fieldErrors: {},
    } as z.inferFlattenedErrors<T>);

  return {
    vxErrors: vxErrors,
    vxErrorsSet: vxErrorsSet,
    vxErrorsReset: vxErrorsReset,
  };
}

// export function useVxFormatErrors<T extends z.ZodType<any, any, any>>() {
//   const [vxErrors, vxErrorsSet] = useState<z.inferFormattedError<T>>(
//     {} as z.inferFormattedError<T>
//   );
//   const vxErrorsReset = () => vxErrorsSet({} as z.inferFormattedError<T>);

//   return {
//     vxErrors: vxErrors,
//     vxErrorsSet: vxErrorsSet,
//     vxErrorsReset: vxErrorsReset,
//   };
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useVxFormatErrors<T extends z.ZodType<any, any, any>>() {
  const [vxErrors, vxErrorsSet] = useState<z.inferFormattedError<T>>();
  const vxErrorsReset = () => vxErrorsSet({} as z.inferFormattedError<T>);

  return {
    vxFormatErrors: vxErrors,
    vxFormatErrorsSet: vxErrorsSet,
    vxFormatErrorsReset: vxErrorsReset,
  };
}

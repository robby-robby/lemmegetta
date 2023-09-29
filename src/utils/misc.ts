// import { ZodError } from "zod";
// Type guard to check if the error is a zod error
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export type ZodErrorObject = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

type DataZodError = {
  data: {
    zodError: ZodErrorObject;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isZodError(error: any): error is DataZodError {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error?.data?.zodError !== undefined;
}

// function GetZodError(error: { data: { zodError: ZodError } }) {
//   // return {
//   //   formErrors: error.data.zodError.formErrors,
//   //   fieldErrors: error.data.zodError.fieldErrors,
//   // } as ZodErrorObject;
// }

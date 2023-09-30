// import { ZodError } from "zod";
// Type guard to check if the error is a zod error
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { Prisma } from "@prisma/client";
// import { type typeToFlattenedError } from "zod";

export type FormFieldErrorsObject<U = object, T = string> = {
  formErrors: string[];
  fieldErrors: Record<keyof U, T[] | string[]> & object;
};

// export type FormFieldErrorsObject<T> = typeToFlattenedError<T  object>;

export function MergeFormErrors(
  ...es: (FormFieldErrorsObject | null)[]
): FormFieldErrorsObject {
  const errors = es.filter((e) => e !== null) as FormFieldErrorsObject[];
  return {
    formErrors: errors.flatMap((e) => e.formErrors),
    fieldErrors: errors.reduce((p, n) => ({ ...p, ...n.fieldErrors }), {}),
  };
}

type DataZodError = {
  data: {
    zodError: FormFieldErrorsObject;
  };
};

type UniqError = {
  data: {
    uniqError: FormFieldErrorsObject;
  };
};

type ValidationError<T> = {
  data: {
    validationError: FormFieldErrorsObject<T>;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUniqError(error: any): error is UniqError {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error?.data?.uniqError !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isZodError(error: any): error is DataZodError {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error?.data?.zodError !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidationError<T>(error: any): error is ValidationError<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return error?.data?.validationError !== null;
}

export function isUniqueConstraintError(
  error: unknown
): error is UniqueConstraintError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export type UniqueConstraintError = {
  code: "P2002";
  meta: {
    target: string[];
  };
} & Prisma.PrismaClientKnownRequestError;

import { Prisma } from "@prisma/client";
import {
  type FormFieldErrorsObject,
  type UniqueConstraintError,
} from "~/utils/misc";

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

export function uniqFormErrors(
  cause: UniqueConstraintError
): FormFieldErrorsObject {
  return {
    formErrors: [],
    fieldErrors: cause.meta.target.reduce(
      (p, n) => ({ ...p, [n]: [`Field must be unique`] }),
      {}
    ),
  };
}

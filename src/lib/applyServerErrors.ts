import { type Path, type UseFormReturn } from "react-hook-form";
import { type FlattenedValidationErrors } from "./FlattenedValidationErrors";

/**
 * Applies the errors to the given `react-hook-form` instance.
 *
 * First applies the root-level form errors, then the field-level errors in
 * the reverse order, so that the first field is applied last - and focused.
 *
 * @example
 * if (!payload.success) return applyServerErrors(form, payload.error);
 */
export function applyServerErrors<F extends Record<string, unknown>>(
  form: UseFormReturn<F>,
  errors: FlattenedValidationErrors<F>
): void {
  for (const message of errors.formErrors) {
    form.setError(
      "root",
      { type: "manual", types: { value: "text" }, message },
      { shouldFocus: true }
    );
  }

  const fieldErrors = errors.fieldErrors;
  for (const fieldName of Object.keys(fieldErrors).reverse() as Path<F>[]) {
    const errors = fieldErrors[fieldName];
    if (!errors) continue;
    for (const message of errors) {
      form.setError(
        fieldName,
        { type: "manual", types: { value: "text" }, message },
        { shouldFocus: true }
      );
    }
  }
}

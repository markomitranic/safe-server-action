import { type z } from "zod";
import { type FlattenedValidationErrors } from "./FlattenedValidationErrors";
import { ServerAction } from "./ServerAction";

/**
 * A factory function for creating server forms.
 *
 * A server form is simply a server action that doesn't throw when the input
 * is invalid. It returns a standardised response envelope with the validation
 * errors flattened.
 *
 * @see {@link ServerAction}
 * @see {@link applyServerErrors}
 * @see {@link FlattenedValidationErrors}
 *
 * @example
 * export const submitFormAction = ServerForm(CreateUserDTO, (input) => {
 *   const { name, email } = input;
 *   return saveUser(name, email);
 * });
 */
export function ServerFormAction<
  InputZod extends z.ZodObject<z.ZodRawShape>,
  Output
>(validator: InputZod, action: (input: z.infer<InputZod>) => Promise<Output>) {
  return async (input: z.infer<InputZod>) => {
    // Validate and Sanitize the input.
    const { error, data: validatedInput } = validator.safeParse(input);
    if (error)
      return {
        data: undefined,
        validationError: error.flatten() as FlattenedValidationErrors<
          z.infer<InputZod>
        >,
      };

    const responseDto = await ServerAction(validator, action)(validatedInput);
    return { validationError: undefined, ...responseDto };
  };
}

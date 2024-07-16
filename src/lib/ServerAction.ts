import { type z } from "zod";
import { type FlattenedValidationErrors } from "./FlattenedValidationErrors";

/**
 * A factory function for creating server actions.
 *
 * Wraps a server action function with Zod Input validation and sanitization
 * as well as a standardised response envelope. Catches any throws and
 * responds with a generic 500 error while logging the actual error details.
 *
 * @example
 * export const submitFormAction = ServerAction(CreateUserDTO, (input) => {
 *   const { name, email } = input;
 *   return saveUser(name, email);
 * });
 */
export function ServerAction<
  InputZod extends z.ZodObject<z.ZodRawShape>,
  Output
>(validator: InputZod, action: (input: z.infer<InputZod>) => Promise<Output>) {
  return async (input: z.infer<InputZod>) => {
    try {
      // Validate and Sanitize the input.
      const { error, data: validatedInput } = validator.safeParse(input);
      if (error)
        return {
          validationError: error.flatten() as FlattenedValidationErrors<
            z.infer<InputZod>
          >,
        };

      // Process the validated data (e.g., save to database)
      const responseDto = await action(validatedInput);
      // Respond with a success envelope.
      return { data: responseDto };
    } catch (e: unknown) {
      console.error(e);
      throw Error("Internal Server Error"); // Mask internal errors.
    }
  };
}

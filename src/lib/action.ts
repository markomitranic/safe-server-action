import { type z } from "zod";

/**
 * Wraps a server action function with validation and sanitization
 * as well as a standardised response envelope.
 *
 * - Uses a zod schema to validate the input.
 * - Responds with a flattened zod error if validation fails.
 * - Calls the action function and responds with the result
 * wrapped in a standardised response envelope.
 * - Catches any unexpected throws and responds with a 500 error
 * while logging the actual error details.
 *
 * ## Usage with `react-hook-form`
 * Since we are using zod for validation, we can rely on the same
 * zod schema on the FE as on the BE. On the client, we use `zodResolver` to
 * with `useForm` to validate the form. On the server, we simply parse and return
 * any errors, which the client can attach to the form using `applyErrors`.
 *
 * @example
 * export const submitFormAction = action(CreateUserDTO, (input) => {
 *   const { name, email } = input;
 *   return saveUser(name, email);
 * });
 */
export function action<
  InputZod extends z.ZodObject<z.ZodRawShape>,
  Output extends Record<string, unknown>
>(validator: InputZod, action: (input: z.infer<InputZod>) => Promise<Output>) {
  return async (
    input: z.infer<InputZod>
  ): Promise<
    | SuccessActionResponse<z.infer<InputZod>>
    | ErrorActionResponse<z.infer<InputZod>>
  > => {
    try {
      // Validate and Sanitize the input.
      const validation = validator.safeParse(input);
      if (!validation.success) return respondWithZodError(validation.error);

      // Process the validated data (e.g., save to database)
      const responseDto = await action(validation.data);

      // Respond with a success envelope.
      return respondWithData(responseDto);
    } catch (e: unknown) {
      console.error(e);
      throw Error("Internal Server Error");
    }
  };
}

export type SuccessActionResponse<D extends Record<string, unknown>> =
  ReturnType<typeof respondWithData<D>>;

/**
 * Creates a response object in a standardised envelope.
 *
 * @example
 * respondWithData({ foo: "bar" });
 * { success: true, timestamp: 1712325980344, data: { foo: "bar"} }
 */
function respondWithData<D extends Record<string, unknown>>(data: D) {
  return {
    success: true as const,
    timestamp: Date.now(),
    data,
  };
}

export type ErrorActionResponse<Z extends Record<string, unknown>> = ReturnType<
  typeof respondWithZodError<Z>
>;

/**
 * Creates an error response object in a standardised envelope
 * based on the zod error.
 *
 * @example
 * respondWithZodError(validation.error);
 * { success: false, timestamp: 1712325980344, error: { formErrors: [], fieldErrors: { name: ["name is required"] } } }
 */
function respondWithZodError<Z>(error: z.ZodError<Z>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type allKeys<T> = T extends any ? keyof T : never;

  return {
    success: false as const,
    timestamp: Date.now(),
    error: error.flatten<Z>() as {
      formErrors: string[];
      fieldErrors: {
        [P in allKeys<Z>]?: string[];
      };
    },
  };
}

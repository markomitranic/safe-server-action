import { z } from "zod";

export const CreateUserDTO = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  age: z.coerce.number().min(18),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

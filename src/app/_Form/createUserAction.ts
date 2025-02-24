"use server";

import { ServerFormAction } from "~/lib/ServerFormAction";
import { CreateUserDTO } from "./CreateUserDTO";

export const createUserAction = ServerFormAction(
  CreateUserDTO,
  async (data) => {
    const { name, email } = data;
    const user = await saveUser(name, email);
    return { name: user.name, email: user.email };
  }
);

async function saveUser(name: string, email: string) {
  // Pretend we're saving the user to a database
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));
  return { id: crypto.randomUUID(), name, email };
}

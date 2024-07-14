"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applyErrorsToForm } from "~/lib/applyErrorsToForm";
import { CreateUserDTO } from "./CreateUserDTO";
import { createUserAction } from "./createUserAction";

export default function Form() {
  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserDTO), // Remove to use zodResolver only on the server.
    defaultValues: {
      name: "Herman Miller",
      email: "herman@miller.com",
      age: 13,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const payload = await createUserAction(data);
        if (!payload.success) return applyErrorsToForm(form, payload.error);
        console.log("Success!", payload.data); // Handle actual success.
      })}
    >
      <input {...form.register("name")} placeholder="Name" />
      {form.formState.errors.name && (
        <p>{form.formState.errors.name.message}</p>
      )}
      <input {...form.register("email")} placeholder="Email" />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}
      <input {...form.register("age")} placeholder="Age" />
      {form.formState.errors.age && <p>{form.formState.errors.age.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
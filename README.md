# Safe Server Action

This is a [T3 Stack](https://create.t3.gg/) project with an example of using a server action to handle a React Hook Form submission.

Example enforces the folllwing practices:

- Explicitly using a `zod` schema to validate the input.
- Responds with a flattened zod error if validation fails and rerenders the fields as invalid.
- Calls the action function and responds with the result wrapped in a standardised response envelope.
- Catches any unexpected throws and responds with a 500 error while logging the actual error details.

The form is validated using [Zod](https://github.com/colinhacks/zod) both on the client and server.

When the parsing fails, the input fields are automatically marked as invalid and the form is re-rendered with the errors. Such a system can be fooled by malicious users, so it is important to validate the input on the server as well.

We can use the same Zod schema on the client and server, so we can rely on the same validation on both sides, and automatically mark the fields as invalid on the client.

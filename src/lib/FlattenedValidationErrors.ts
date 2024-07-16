// eslint-disable-next-line @typescript-eslint/no-explicit-any
type allKeys<T> = T extends any ? keyof T : never;

export type FlattenedValidationErrors<Z extends Record<string, unknown>> = {
  formErrors: string[];
  fieldErrors: {
    [P in allKeys<Z>]?: string[];
  };
};

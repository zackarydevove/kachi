import { Dispatch, SetStateAction } from "react";
import { z, ZodObject, ZodRawShape } from "zod";

export function parseSchemaError<TData>(
  data: TData,
  schema: ZodObject<ZodRawShape>,
  setError: Dispatch<SetStateAction<{ message: string; path: string } | null>>
): boolean {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    if (firstError) {
      setError({
        message: firstError.message,
        path: firstError.path[0] as string,
      });
    }
    return false;
  }
  setError(null);
  return true;
}

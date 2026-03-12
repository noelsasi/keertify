const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validates that the given string is a well-formed v4 UUID.
 * Rejects anything that isn't — empty strings, malformed values, injection attempts.
 */
export function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value)
}

export const SESSION_HEADER = "x-session-id" as const

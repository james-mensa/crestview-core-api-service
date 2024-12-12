export const httpStatusCodes = {
  OK: { code: 200, message: "Request successful" },
  BAD_REQUEST: { code: 400, message: "Bad request" },
  NOT_FOUND: { code: 404, message: "target not found" },
  UNAUTHORIZED: { code: 401, message: "Invalid credentials" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Server error" },
} as const;

export type HttpStatusCode =
  (typeof httpStatusCodes)[keyof typeof httpStatusCodes];

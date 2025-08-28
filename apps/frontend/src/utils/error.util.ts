export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export function parseApiError(err: unknown): {
  status?: number;
  message?: string;
} {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as ApiError).response;
    if (response && typeof response === "object") {
      return {
        status: response.status,
        message: response.data?.message,
      };
    }
  }
  return {};
}

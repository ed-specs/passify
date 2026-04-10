/**
 * Maps Supabase and internal error codes to user-friendly messages
 * Prevents sensitive information disclosure
 */
export const getPublicErrorMessage = (error) => {
  // Handle error object or string
  const errorCode = error?.code || error?.message || "";
  const errorMessage = error?.message || "";

  const errorMap = {
    invalid_grant: "Invalid email or password",
    invalid_credentials: "Invalid email or password",
    user_not_found: "Invalid email or password",
    user_already_exists: "Email already in use",
    weak_password: "Password does not meet security requirements",
    over_email_send_rate_limit: "Too many requests. Please try again later.",
    over_request_rate_limit: "Too many requests. Please try again later.",
    email_not_confirmed: "Please verify your email before logging in",
    email_address_not_confirmed: "Please verify your email before logging in",
    suspicious_activity: "Suspicious activity detected. Please try again.",
    too_many_attempts: "Too many failed attempts. Please try again later.",
    network_error: "Network error. Please check your connection.",
    validation_error: "Please check your input and try again",
  };

  // Check if error code exists in map
  if (errorCode in errorMap) {
    return errorMap[errorCode];
  }

  // Check if error message contains known keywords
  if (
    errorMessage.toLowerCase().includes("invalid") ||
    errorMessage.toLowerCase().includes("failed")
  ) {
    return "An error occurred. Please try again.";
  }

  // Default fallback
  return "An error occurred. Please try again.";
};

/**
 * Categorize errors for internal logging
 */
export const getErrorCategory = (error) => {
  const errorCode = error?.code || error?.message || "";

  if (
    errorCode.includes("user") ||
    errorCode.includes("email") ||
    errorCode.includes("password")
  ) {
    return "AUTH_ERROR";
  }

  if (
    errorCode.includes("rate") ||
    errorCode.includes("limit") ||
    errorCode.includes("too_many")
  ) {
    return "RATE_LIMIT_ERROR";
  }

  if (errorCode.includes("network")) {
    return "NETWORK_ERROR";
  }

  if (errorCode.includes("validation")) {
    return "VALIDATION_ERROR";
  }

  return "UNKNOWN_ERROR";
};

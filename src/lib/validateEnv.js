export function validateEnv() {
  const requiredEnvs = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvs.join(", ")}`,
    );
  }
}

// Call this in your next.config.mjs or app initialization
if (typeof window === "undefined") {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error.message);
  }
}

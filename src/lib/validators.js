import DOMPurify from "dompurify";

export const validators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isStrongPassword: (pwd) => {
    return (
      pwd.length >= 12 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    );
  },

  getPasswordStrength: (pwd) => {
    let strength = 0;

    // Check length
    if (pwd.length >= 8) strength += 20;
    if (pwd.length >= 12) strength += 20;
    if (pwd.length >= 16) strength += 10;

    // Check character types
    if (/[a-z]/.test(pwd)) strength += 10;
    if (/[A-Z]/.test(pwd)) strength += 10;
    if (/[0-9]/.test(pwd)) strength += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;

    return Math.min(strength, 100);
  },

  getPasswordStrengthLabel: (strength) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  },

  sanitizeInput: (input) => {
    if (typeof input !== "string") return "";
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  },

  validateName: (name) => {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(name);
  },

  validatePasswordsMatch: (pwd1, pwd2) => {
    return pwd1 === pwd2 && pwd1.length > 0;
  },

  isEmpty: (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    );
  },
};

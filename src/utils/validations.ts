/**
 * Core validation utility for the TMS system.
 * Handles rule-based validation for form inputs.
 */

export const required = (value: any) => {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
    return "This field is required";
  }
  return undefined;
};

export const email = (value: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email address";
  }
  return undefined;
};

export const password = (value: any) => {
  if (String(value).length < 6) {
    return "Password must be at least 6 characters long";
  }
  return undefined;
};

export const number = (value: any) => {
  if (isNaN(Number(value)) || value === "") {
    return "Please enter a valid number";
  }
  return undefined;
};

export const validateAll = (rules: Record<string, any>, value: any, form: any): string | undefined => {
  if (!rules) return undefined;

  for (const [rule, param] of Object.entries(rules)) {
    // Required check
    if (rule === "required" && param) {
      const error = required(value);
      if (error) return typeof param === "string" ? param : error;
    }

    // Only skip other validations if value is empty/null (unless it's a custom sync validation)
    if (value === undefined || value === null || value === "") continue;

    // Email check
    if (rule === "email" && param) {
      const error = email(value);
      if (error) return typeof param === "string" ? param : error;
    }

    // Password check
    if (rule === "password" && param) {
      const error = password(value);
      if (error) return typeof param === "string" ? param : error;
    }

    // Number check
    if (rule === "number" && param) {
      const error = number(value);
      if (error) return typeof param === "string" ? param : error;
    }

    // Min length check
    if (rule === "min" && typeof param === "number") {
      if (String(value).length < param) {
        return `Minimum ${param} characters required`;
      }
    }

    // Max length check
    if (rule === "max" && typeof param === "number") {
      if (String(value).length > param) {
        return `Maximum ${param} characters allowed`;
      }
    }

    // Regex pattern check
    if (rule === "pattern" && param instanceof RegExp) {
      if (!param.test(value)) {
        return "Invalid format";
      }
    }

    // Custom validation function
    if (rule === "custom" && typeof param === "function") {
      const error = param(value, form);
      if (error) return error;
    }
  }

  return undefined;
};

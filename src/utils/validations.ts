import { useLangStore } from "@/store/lang.store";

const t = (key: any, params?: any) => useLangStore().t(key, params);

export function fileSize(
  value: File | File[] | null | undefined,
  size: number,
): [boolean, string] {
  // Allow empty file for optional fields
  if (!value) return [true, ""];

  const files = Array.isArray(value) ? value : [value];

  for (const file of files) {
    if (file instanceof File && file.size > size) {
      return [false, t("validation.file_size", { size: size / 1024 / 1024 })];
    }
  }

  return [true, ""];
}

export function fileType(
  value: File | File[] | null | undefined,
  accepted: string,
): [boolean, string] {
  if (!value) return [true, ""];

  const files = Array.isArray(value) ? value : [value];
  const acceptedTypes = accepted.split(",").map((t) => t.trim());

  for (const file of files) {
    if (!(file instanceof File)) continue;
    const type = file.type;
    const name = file.name.toLowerCase();
    const isValid = acceptedTypes.some((acc) => {
      const lowerAcc = acc.toLowerCase();
      if (lowerAcc.startsWith(".")) {
        return name.endsWith(lowerAcc);
      }
      if (lowerAcc.endsWith("/*")) {
        const prefix = lowerAcc.replace("/*", "");
        return type.startsWith(prefix);
      }
      return type === acc || type.includes(acc);
    });

    if (!isValid) return [false, t("validation.invalid_file_type")];
  }

  return [true, ""];
}

export function greaterThanToday(value: string): [boolean, string] {
  const today = new Date();
  const date = new Date(value);
  if (date <= today) return [false, t("validation.greater_than_today")];
  return [true, ""];
}

export function greaterThanGivenDate(
  value: string,
  date: string,
  message?: string,
): [boolean, string] {
  const dateValue = new Date(value);
  const givenDate = new Date(date);
  if (dateValue < givenDate)
    return [false, message ?? t("validation.greater_than_given_date")];
  return [true, ""];
}

export function lessThanGivenDate(
  value: string,
  date: string,
  message?: string,
): [boolean, string] {
  const dateValue = new Date(value);
  const givenDate = new Date(date);
  if (dateValue > givenDate)
    return [false, message ?? t("validation.less_than_given_date")];
  return [true, ""];
}

export function lessThanToday(value: string): [boolean, string] {
  const today = new Date();
  const date = new Date(value);
  if (date > today) return [false, t("validation.less_than_today")];
  return [true, ""];
}

export function greaterThanGivenTime(
  value: string,
  time: string,
): [boolean, string] {
  const timeValue = new Date(value);
  const givenTime = new Date(time);
  if (timeValue < givenTime)
    return [false, t("validation.greater_than_given_time")];
  return [true, ""];
}

export function lessThanTime(value: string): [boolean, string] {
  const time = new Date(value);
  const now = new Date();
  if (time > now) return [false, t("validation.less_than_time_now")];
  return [true, ""];
}

export function lessThanGivenTime(
  value: string,
  time: string,
): [boolean, string] {
  const timeValue = new Date(value);
  const givenTime = new Date(time);
  if (timeValue > givenTime)
    return [false, t("validation.less_than_given_time")];
  return [true, ""];
}

export function greatetThanGivenTime(
  value: string,
  time: string,
): [boolean, string] {
  const timeValue = new Date(value);
  const givenTime = new Date(time);
  if (timeValue < givenTime)
    return [false, t("validation.greater_than_given_time")];
  return [true, ""];
}

export function phone(value: string): [boolean, string] {
  let regex = /^(\+?251(9|7)|0?[79])[0-9]{8}$/;
  if (regex.test(value)) return [true, ""];

  if (`${value}`.length > 9)
    return [false, t("validation.check_number_length")];
  return [false, t("validation.invalid_phone")];
}

export function noSpace(value: string): [boolean, string] {
  if (/\s/.test(value)) return [false, t("validation.no_space")];
  return [true, ""];
}

export function maxLength(value: string, length: number): [boolean, string] {
  if (value.length > length)
    return [false, t("validation.max_length", { length })];
  return [true, ""];
}

export function exactLength(value: string, length: number): [boolean, string] {
  if (value.length !== length)
    return [false, t("validation.exact_length", { length })];
  return [true, ""];
}

export function minLength(value: string, length: number): [boolean, string] {
  if (value.length < length)
    return [false, t("validation.min_length", { length })];
  return [true, ""];
}

export function number(value: string): [boolean, string] {
  if (isNaN(Number(value))) return [false, t("validation.invalid_number")];
  return [true, ""];
}

export function pos_number(value: string) {
  if (isNaN(Number(value)) || +value < 0)
    return [false, t("validation.invalid_number")];
  return [true, ""];
}

export function date(value: string): [boolean, string] {
  const date = new Date(value);
  if (isNaN(date.getTime())) return [false, t("validation.invalid_date")];
  return [true, ""];
}

export function gt(value: string, other: string): [boolean, string] {
  if (Number(value) <= Number(other))
    return [false, t("validation.gt", { other })];
  return [true, ""];
}

export function gte(value: string, other: string): [boolean, string] {
  if (Number(value) < Number(other))
    return [false, t("validation.gte", { other })];
  return [true, ""];
}

export function lt(value: string, other: string): [boolean, string] {
  if (Number(value) >= Number(other))
    return [false, t("validation.lt", { other })];
  return [true, ""];
}

export function lte(value: string, other: string): [boolean, string] {
  if (Number(value) > Number(other))
    return [false, t("validation.lte", { other })];
  return [true, ""];
}

export function name(value: string, message?: string): [boolean, string] {
  if (!/^[a-zA-Z ]+$/.test(value))
    return [false, message ?? t("validation.invalid_name")];
  return [true, ""];
}

export function alpha(
  value: string,
  message: string | null,
): [boolean, string] {
  if (!/^[a-zA-Z]+$/.test(value))
    return [false, message ?? t("validation.invalid_alpha")];
  return [true, ""];
}

export function alphaNumeric(value: string): [boolean, string] {
  if (!/^[a-zA-Z0-9]+$/.test(value))
    return [false, t("validation.invalid_alpha_numeric")];
  return [true, ""];
}

export function alphaNumericWithSpecial(value: string): [boolean, string] {
  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$/.test(value))
    return [false, t("validation.invalid_alpha_numeric_special")];
  return [true, ""];
}

export function price(value: string): [boolean, string] {
  if (!/^[0-9]+(\.[0-9]+)?$/.test(value))
    return [false, t("validation.invalid_price")];
  return [true, ""];
} 

export function dateGreaterThanOrEqalToToday(value: string): [boolean, string] {
  if (!value) return [true, ""];
  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return [false, t("validation.greater_than_today")];
  return [true, ""];
}

export function dateLessThanOrEqalToToday(value: string): [boolean, string] {
  if (!value) return [true, ""];
  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) return [false, t("validation.less_than_today")];
  return [true, ""];
}

export function email(value: string): [boolean, string] {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (regex.test(value)) return [true, ""];
  return [false, t("validation.email_required")];
}

export function password(value: string): [boolean, string[]] {
  let errors = [];
  if (!value) errors.push(t("validation.password_required"));
  if (value.length < 8) errors.push(t("validations.password_min_length"));
  // if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) errors.push(t("validation.password_alphanumeric"));
  // if (!/[A-Z]/.test(value)) errors.push(t("validation.password_uppercase"));
  // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value)) errors.push(t("validation.password_special_char"));
  return [errors.length === 0, errors];
}

export function required(value: any, message?: string): [boolean, string] {
  if (value === undefined || value === null || value === "") {
    return [false, message ?? t("validation.required")];
  }
  if (Array.isArray(value) && value.length === 0) {
    return [false, message ?? t("validation.required")];
  }
  return [true, ""];
}

export function isEqualTo(value: string, match: string): [boolean, string] {
  if (value !== match) return [false, t("validation.values_not_match")];
  return [true, ""];
}

export function passwordConfirm(
  value: string,
  match: string,
): [boolean, string] {
  if (value !== match) return [false, t("validation.password_not_match")];
  return [true, ""];
}

export function isChecked(value: boolean, message?: string): [boolean, string] {
  if (!!value) return [true, ""];
  return [false, message ?? t("validation.not_checked")];
}

export default {
  greaterThanGivenDate,
  lessThanGivenDate,
  fileSize,
  required,
  isEqualTo,
  exactLength,
  phone,
  isChecked,
  maxLength,
  minLength,
  number,
  email,
  dateGreaterThanOrEqalToToday,
  dateLessThanOrEqalToToday,
  price,
  alpha,
  alphaNumeric,
  alphaNumericWithSpecial,
  gt,
  gte,
  lt,
  lte,
  date,
  noSpace,
  password,
  passwordConfirm,
  validateTimeRange,
  fileType,
};

export function validateTimeRange(value: string): [boolean, string] {
  if (!value) return [true, ""];

  const [start, end] = value.split("-");
  if (!start || !end) return [false, t("validation.select_both_times")];

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
    return [false, t("validation.invalid_time_format")];
  }

  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  if (startTime >= endTime) return [false, t("validation.start_before_end")];
  return [true, ""];
}

export const validateAll = (
  funs: Record<string, any> = {},
  value: any,
  form: any,
): string | undefined => {
  if (!funs || Object.keys(funs).length === 0) return undefined;

  // Prioritize required-like validations
  const priorityKeys = [
    "required",
    "isChecked",
    ...Object.keys(funs).filter((key) =>
      key.toLowerCase().startsWith("required"),
    ),
  ];

  for (const key of priorityKeys) {
    if (funs[key] && typeof funs[key] === "function") {
      const result = funs[key](value, undefined, form);
      const [isValid, error] = Array.isArray(result)
        ? result
        : [!result, result];
      if (!isValid) return error;
    }
  }

  // Check if value is truly empty (null, undefined, or empty string)
  // We keep 0 and false as non-empty values.
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  // If the value is empty and we passed all priority validations, skip further validations
  if (isEmpty) {
    return undefined;
  }

  // Run remaining validations
  for (const [key, fun] of Object.entries(funs)) {
    if (priorityKeys.includes(key) || typeof fun !== "function") continue;

    const result = (fun as Function)(value, undefined, form);
    const [isValid, error] = Array.isArray(result) ? result : [!result, result];
    if (!isValid) return error;
  }

  return undefined;
};

/**
 * Validate each item in an array against a field-level rules schema.
 *
 * Usage:
 * ```ts
 * const errors = reactive<Record<string, string>>({});
 * validateArrayItems(values, errors, {
 *   item:      { required },
 *   uom:       { required },
 *   unitPrice: { required, price },
 *   quantity:  { required, number },
 * });
 * ```
 *
 * Each key in `rules` maps to a field name on the item objects.
 * The validators are the same `(value) => [boolean, string]` functions
 * used everywhere else in this file.
 *
 * Error keys use a stable identifier from each item (default: `fakeId`)
 * instead of the array index, so adding/removing items doesn't corrupt
 * existing error entries. Keys look like `"item_abc123"`, `"unitPrice_def456"`.
 *
 * Returns the first error message found, or `undefined` if all valid.
 */
export const validateArrayItems = (
  values: any[],
  errors: Record<string, string>,
  rules: Record<string, Record<string, Function>>,
  idKey: string = "fakeId",
  optional: boolean = false,
): string | undefined => {
  // Clear previous errors
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }

  if (!Array.isArray(values) || values.length === 0) {
    return optional ? undefined : "At least one item is required";
  }

  let firstError: string | undefined;

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const id = row[idKey] ?? i;

    for (const [field, validators] of Object.entries(rules)) {
      const value = row[field];
      const error = validateAll(validators, value, {
        allValues: values,
        index: i,
      });
      if (error) {
        errors[`${field}_${id}`] = error;
        if (!firstError) firstError = error;
      }
    }
  }

  return firstError;
};

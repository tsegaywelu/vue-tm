import { maxLength, minLength, name } from "./validations";
import { RateType, type Navs } from "./type";
import { openModal } from "@customizer/modal-x";
import { useAuthStore } from "@/store/authStore";
import ApiService from "@/api/ApiService";

function* getId() {
  let id = 0;

  while (true) {
    yield `generated_id_${++id}`;
  }
}

export const DocumentedUploads = [
  { label: "Uploaded", value: true },
  { label: "Not Uploaded", value: false },
];

export const Damage = [
  { label: "Damaged", value: true },
  { label: "Not Damaged", value: false },
];
export const VehicleOwnership = [
  {
    label: "Owned",
    value: "owned",
  },
  {
    label: "Rental",
    value: "rental",
  },
  {
    label: "Leased",
    value: "leased",
  },
];

export const Triptype = [
  {
    label: "Single Trip",
    value: "single_trip",
  },
  {
    label: "Round Trip",
    value: "round_trip",
  },
];

export const ProductT: {
  label: keyof typeof ProductType;
  value: ProductType;
}[] = [
  {
    label: "In Bound",
    value: "IN_BOUND",
  },
  {
    label: "Out Bound",
    value: "OUT_BOUND",
  },
  {
    label: "Site Transfer",
    value: "SITE_TRANSFER",
  },
];

export const ShipmentStatus = [
  { label: "Vehicle Assigned", value: "vehicle_assigned" },
  { label: "Accepted", value: "accepted" },

  {
    label: "Waiting to Load at Origin",
    value: "waiting_to_load_at_origin",
  },
  {
    label: "Loading Started at Origin",
    value: "loading_started_at_origin",
  },
  { label: "Loaded at Origin", value: "loaded_at_origin" },
  { label: "Departed", value: "departed" },
  { label: "En Route to Destination", value: "en_route_to_destination" },
  { label: "Arrived at Destination", value: "arrived_at_destination" },
  {
    label: "Waiting to Offload at Destination",
    value: "waiting_to_offload_at_destination",
  },

  {
    label: "Offloading Started at Destination",
    value: "offloading_started_at_destination",
  },
  {
    label: "Offloaded at Destination",
    value: "offloaded_at_destination",
  },
  {
    label: "Waiting to Load at Destination",
    value: "waiting_to_load_at_destination",
  },
  {
    label: "Loading Started at Destination",
    value: "loading_started_at_destination",
  },
  {
    label: "Loaded at Destination",
    value: "loaded_at_destination",
  },
  { label: "En Route to Origin", value: "en_route_to_origin" },
  { label: "Arrived at Origin", value: "arrived_at_origin" },
  {
    label: "Waiting to Offload at Origin",
    value: "waiting_to_offload_at_origin",
  },
  {
    label: "Offloading Started at Origin",
    value: "offloading_started_at_origin",
  },
  {
    label: "Offloaded at Origin",
    value: "offloaded_at_origin",
  },
  { label: "Completed", value: "completed" },
  { label: "Custom", value: "custom" },
  { label: "Terminated", value: "terminated" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Delayed", value: "delayed" },
];

//.sort((a, b) => a.label.localeCompare(b.label));

export const genId = getId();

export const getStaticUrl = (filePath?: string) => {
  if (!filePath) return "";
  const normalizedPath = filePath.replace(/\\/g, "/");
  const basePath = import.meta.env.v_STATIC_PATH || getStaticAssetspath("core");
  return `${basePath.replace(/\/$/, "")}/${encodeURI(normalizedPath).replace(/^\//, "")}`;
};

export enum PaymentTerm {
  "On Delivery" = "ON_DELIVERY",
  "7 Days" = "DAYS_7",
  "14 Days" = "DAYS_14",
  "30 Days" = "DAYS_30",
  "Escrow" = "ESCROW",
}

export const formatStatus = (status?: string) => {
  if (!status) return "-";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatPricing = (type?: string) => {
  if (type === "per_quintal") return "Per Quintal";
  if (type === "per_kilometer") return "Per Kilometer";
  return formatStatus(type);
};

export function getApi(url: string, baseUrl?: string) {
  return new ApiService(`${baseUrl ?? import.meta.env.v_API_URL}${url}`);
}

export function getStaticAssetspath(service: "user" | "core") {
  if (import.meta.env.DEV) {
    if (service == "user") {
      return import.meta.env.v_USER_ASSET_URL;
    }
    if (service == "core") {
      return import.meta.env.v_CORE_URL;
    }
  }

  return import.meta.env?.v_ASSEST_URL;
}

export type FormResponse<T> = Record<keyof T, T[keyof T]>;

export function perKiloOrQuintal(
  type: RateType,
  value: number,
  t: (key: any) => string,
) {
  if (type === RateType["Per Quintal"]) {
    return `${currencyFormatter(value)} / ${t("common.quintal")}`;
  }
  return `${currencyFormatter(value)} / Km`;
}

export function kilometerFormater(number: number, t?: (key: any) => string) {
  return `${distanceFormatter(number)}${t ? t("common.km") : "km"}`;
}

export function distanceFormatter(distance: number): string {
  if (!distance && distance !== 0) return "0";
  const absDistance = Math.abs(distance);

  // Calculate how many digits are in the integer part
  const integerPart = Math.floor(absDistance);
  const integerDigits =
    integerPart === 0
      ? 1
      : Math.max(0, Math.floor(Math.log10(absDistance)) + 1);

  // Aim for a total of 6 digits.
  // maxDecimals = 6 - digits in integer part
  const maxDecimals = Math.max(0, 6 - integerDigits);

  // Use Intl.NumberFormat for clean formatting without scientific notation issues
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
    useGrouping: false, // Typically distance doesn't use commas in this context, but can be enabled if needed
  }).format(distance);
}

export function addDayToDate(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function onKey(
  targetKey: string | string[],
  callback: (...args: any[]) => void,
) {
  return function (e: React.KeyboardEvent | KeyboardEvent) {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];
    if (keys.includes(e.key) || (keys.includes("Enter") && e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();
      callback(e);
    }
  };
}

import { validateAll } from "./validations";
import type { ProductType } from "@/modules/operation/operation.types";

export { validateAll };

export async function allLogout() {
  const res = await openModal("ConfirmationModal");
  if (res) {
    useAuthStore().logout();
    location.href = "/auth/login";
  }
}

type Match = {
  name: string;
  path: string;
  labelKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  search?: any;
};

export function pathMatches(template: string, realPath: string) {
  const templateSegments = template.split("/").filter(Boolean);
  const realSegments = realPath.split("/").filter(Boolean);

  if (templateSegments.length !== realSegments.length) return false;

  return templateSegments.every((seg, i) => {
    return seg.startsWith("$") || seg === realSegments[i];
  });
}

export function isRouteActive(nav: Navs, currentPath: string): boolean {
  if (nav.path && pathMatches(nav.path as string, currentPath)) {
    return true;
  }
  if (nav.children) {
    return nav.children.some((child) => isRouteActive(child, currentPath));
  }
  return false;
}

export function getNestedRoute(
  navs: Navs[],
  targetPath: string,
  search?: any,
): Match[] | undefined {
  for (const nav of navs) {
    if (nav.path !== undefined && pathMatches(nav.path, targetPath)) {
      const templateSegments = nav.path.split("/").filter(Boolean);
      const realSegments = targetPath.split("/").filter(Boolean);
      const params: Record<string, string> = {};
      templateSegments.forEach((seg: string, i: number) => {
        if (seg.startsWith("$") && realSegments[i]) {
          params[seg.slice(1)] = realSegments[i];
        }
      });
      return [
        {
          name: nav.name,
          labelKey: nav.labelKey,
          titleKey: nav.titleKey,
          subtitleKey: nav.subtitleKey,
          path: targetPath,
          params,
          search,
        } as any,
      ];
    }
    if (nav.children?.length) {
      const childMatch = getNestedRoute(
        nav.children as Navs[],
        targetPath,
        search,
      );
      if (childMatch) {
        // params are stored in the last element (the leaf) of the returned array
        const leafMatch = childMatch[childMatch.length - 1] as any;
        const params = leafMatch.params || {};

        let parentPath = nav.path || "";
        if (parentPath.includes("$")) {
          const segments = parentPath
            .split("/")
            .filter(Boolean)
            .map((seg: string) => {
              if (seg.startsWith("$")) {
                const key = seg.slice(1);
                return params[key] || seg;
              }
              return seg;
            });
          parentPath =
            (nav.path?.startsWith("/") ? "/" : "") + segments.join("/");
        }

        const current: Match = {
          name: nav.name,
          labelKey: nav.labelKey,
          titleKey: nav.titleKey,
          subtitleKey: nav.subtitleKey,
          path: parentPath,
          search: search,
        };
        return [current, ...childMatch];
      }
    }
  }

  return undefined; // Not found
}

export function formatPhoneNumberForDisplay(phoneNumber: string) {
  if (!phoneNumber) return "";
  // Remove all non-digit characters to get a clean number for normalization
  const clean = phoneNumber.replace(/\D/g, "");
  const normalized = formatNumber(clean);

  // Match +251 followed by 9 or 10 digits and group them
  // Group 1: 3 or 4 digits, Group 2: 3 digits, Group 3: 3 digits
  const match = normalized.match(/^(\+251)(\d{3,4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
  }

  // Fallback: if it doesn't match the expected pattern, return the normalized version
  return normalized;
}

export function formatNumber(value: string) {
  if (value.startsWith("0")) return value.replace(/^0/, "+251");
  if (value.startsWith("9") || value.startsWith("7")) return `+251${value}`;
  if (value.startsWith("251")) return `+${value}`;
  return value;
}

export const nameValidation = {
  name: (value: string) => name(value.trim(), "Not a valid name"),
  minLength: (value: string) => minLength(value.trim(), 2),
  maxLength: (value: string) => maxLength(value.trim(), 20),
};

export function groupBy<T>(array: T[], key: (item: T) => string) {
  return array.reduce(
    (acc, item) => {
      const group = key(item);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function downloadFile(file: any, name: string | null) {
  if (file) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = name ?? file.name;
    a.click();
  }
}

/**
 * Fetches a file from a URL and triggers a browser download.
 * Uses axios for progress tracking via onProgress callback.
 */
export async function downloadFromUrl(
  url: string,
  filename: string,
  onProgress?: (loaded: number, total: number) => void,
) {
  const { default: axios } = await import("axios");
  try {
    const res = await axios.get(url, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent.loaded, progressEvent.total || 0);
        }
      },
    });

    const contentType = res.headers["content-type"] || "";
    const blob = new Blob([res.data], { type: contentType });

    // Map common MIME types to extensions
    const extMap: Record<string, string> = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "application/pdf": ".pdf",
      "text/csv": ".csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        ".xlsx",
    };
    const ext = extMap[contentType.split(";")[0]] || "";
    const finalName = filename.includes(".") ? filename : `${filename}${ext}`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = finalName;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    console.error("Download failed", err);
  }
}

export function setFormData(obj: any) {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v instanceof Blob || v instanceof File) {
          fd.append(key, v);
        } else if (typeof v === "string" || typeof v === "number") {
          fd.append(key, String(v));
        }
      });
    } else if (value instanceof Blob || value instanceof File) {
      fd.append(key, value);
    } else if (typeof value === "string" || typeof value === "number") {
      fd.append(key, String(value));
    }
  });

  return fd;
}

export function dummyDataIfDev<T extends object>(data: T) {
  return import.meta.env.DEV
    ? data
    : Object.keys(data).reduce((acc, key) => {
        acc[key as keyof T] =
          typeof data[key as keyof T] === "string"
            ? ("" as any)
            : (null as any);
        return acc;
      }, {} as T);
}

export function weightFormatter(weight: number) {
  return `${numberFormatter(weight || 0)} Q`;
}

export function currencyFormatter(
  amount: number,
  currency = "ETB",
  locale = "am-ET",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount || 0);
}

export function dateFormatter(date: string | Date, locale = "en-US") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function dateTimeFormatter(date: string | Date, locale = "en-US") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function relativeTimeFormatter(
  date: string | Date,
  t?: (key: any) => string,
) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return t ? t("common.just_now" as any) : "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes}${t ? t("common.minute_short" as any) : "m"}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 99) return `${hours}${t ? t("common.hour_short" as any) : "h"}`;

  return `99${t ? t("common.hour_short" as any) : "h"}`;
}

export function timeFormatter(time: string | Date) {
  if (!time) return "";
  const d = typeof time === "string" ? new Date(time) : time;
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function numberFormatter(number: number) {
  const formatter = new Intl.NumberFormat("en-US");

  const formattedNumber = formatter.format(number);
  return formattedNumber;
}

export function capitalizeFirstLetter(
  cb: (val: string) => void,
  enabled = true,
): any {
  return (ev: Event) => {
    const value = (ev.target as HTMLInputElement | HTMLTextAreaElement)
      .value as string;
    if (!value) return cb("");
    if (!enabled) return cb(value);
    cb(value.trim().charAt(0).toUpperCase() + value.slice(1));
  };
}

export function getMonthAndDate(dateString?: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}/${month}`;
}

export function getOrdinalSuffix(i: number, language?: string): string {
  if (language === "am") {
    return i + "ኛ";
  }
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

export function isDeepEqual(obj1: any, obj2: any, selective = false): boolean {
  // If either value is not an object (primitive), use simple strict equality
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }

  // Helper to normalize values for comparison (treat null, undefined, empty string as equivalent)
  const normalize = (val: any) =>
    val === null || val === undefined || val === "" ? undefined : val;

  const v1 = normalize(obj1);
  const v2 = normalize(obj2);

  if (v1 === v2) return true;

  // Handle case where one node normalized to undefined but the other is a non-empty object
  if (v1 === undefined || v2 === undefined) return v1 === v2;

  const keys1 = Object.keys(v1);
  const keys2 = Object.keys(v2);

  // If selective is true, we only care about keys present in obj1
  const keysToCompare = selective
    ? keys1
    : Array.from(new Set([...keys1, ...keys2]));

  for (const key of keysToCompare) {
    if (!isDeepEqual(v1[key], v2[key], selective)) {
      return false;
    }
  }

  return true;
}

export function shortDateWithDayFormatter(
  date: string | Date,
  locale = "en-US",
) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    d,
  );
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${weekday} ${month}/${day}`;
}

export function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

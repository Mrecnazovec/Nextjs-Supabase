const DASH = "-";

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export function formatDateValue(value: unknown): string {
  if (!value) {
    return DASH;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function formatCurrencyValue(value: unknown): string {
  const number = toNumber(value);
  if (number === null) {
    return DASH;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatPercentValue(value: unknown): string {
  const number = toNumber(value);
  if (number === null) {
    return DASH;
  }

  return `${number.toFixed(0)}%`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const ISO_DATETIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
const ISO_DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME_WITH_TIMEZONE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[+-]\d{2}:\d{2}$/;


function matchesDateTimeFormat(value: any): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    ISO_DATETIME_PATTERN.test(value)
  );
}


function matchesDateOnlyFormat(value: any): boolean {
  return (
    typeof value === "string" &&
    value.length === 10 &&
    ISO_DATE_ONLY_PATTERN.test(value)
  );
}


function matchesDateTimeWithTimezoneFormat(value: any): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    ISO_DATETIME_WITH_TIMEZONE_PATTERN.test(value)
  );
}


function convertDateOnlyString(dateStr: string): Date {
  const tempDate = new Date(dateStr);
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth();
  const day = tempDate.getDate() + 1;
  return new Date(year, month, day);
}

function convertDateTimeString(dateTimeStr: string): Date {
  const parts = dateTimeStr.split(/[T:\-.\s]/g).map(Number);

  const [year, month, day, hour = 0, minute = 0, second = 0] = parts;

  const millisecond = parts[6]
    ? parseInt(String(parts[6]).substring(0, 3).padEnd(3, "0"))
    : 0;

  return new Date(year, month - 1, day, hour, minute, second, millisecond);
}


export function handleDates(data: any): any {
  if (data === null || data === undefined || typeof data !== "object") {
    return data;
  }

  for (const property in data) {
    if (!Object.prototype.hasOwnProperty.call(data, property)) {
      continue;
    }

    const value = data[property];

    if (matchesDateTimeWithTimezoneFormat(value)) {
      data[property] = convertDateTimeString(value);
    } else if (matchesDateOnlyFormat(value)) {
      data[property] = convertDateOnlyString(value);
    } else if (matchesDateTimeFormat(value)) {
      data[property] = convertDateTimeString(value);
    } else if (typeof value === "object") {
      handleDates(value);
    }
  }

  return data;
}

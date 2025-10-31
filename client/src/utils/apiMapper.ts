/* eslint-disable @typescript-eslint/no-explicit-any */

function convertToCamelCase(str: string): string {
  return str.replace(/[_-](\w)/g, (_, char) => char.toUpperCase());
}


function convertToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function isPlainObject(value: any): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}


export const snakeToCamel = <T>(data: any): T => {
  if (Array.isArray(data)) {
    return data.map((item) => snakeToCamel(item)) as any;
  }

  if (isPlainObject(data)) {
    const transformed: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelKey = convertToCamelCase(key);
        transformed[camelKey] = snakeToCamel(data[key]);
      }
    }

    return transformed as T;
  }

  return data as T;
};


export const camel_to_snake_serializing_date = <T>(data: any): T => {
  if (data instanceof Date) {
    return data.toISOString().replace(/\.\d{3}Z$/, "Z") as any;
  }

  if (Array.isArray(data)) {
    return data.map((item) => camel_to_snake_serializing_date(item)) as any;
  }

  if (isPlainObject(data)) {
    const transformed: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const snakeKey = convertToSnakeCase(key);
        transformed[snakeKey] = camel_to_snake_serializing_date(data[key]);
      }
    }

    return transformed as T;
  }

  return data as T;
};

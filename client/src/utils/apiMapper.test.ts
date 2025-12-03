import { describe, it, expect } from "vitest";
import { snakeToCamel, camel_to_snake_serializing_date } from "./apiMapper";

describe("apiMapper", () => {
  describe("snakeToCamel", () => {
    it("converts snake_case keys to camelCase", () => {
      const input = {
        user_name: "John",
        email_address: "john@example.com",
        is_active: true,
      };

      const result = snakeToCamel(input);

      expect(result).toEqual({
        userName: "John",
        emailAddress: "john@example.com",
        isActive: true,
      });
    });

    it("handles nested objects", () => {
      const input = {
        user_data: {
          first_name: "John",
          last_name: "Doe",
        },
      };

      const result = snakeToCamel(input);

      expect(result).toEqual({
        userData: {
          firstName: "John",
          lastName: "Doe",
        },
      });
    });

    it("handles arrays", () => {
      const input = [{ user_name: "John" }, { user_name: "Jane" }];

      const result = snakeToCamel(input);

      expect(result).toEqual([{ userName: "John" }, { userName: "Jane" }]);
    });
  });

  describe("camel_to_snake_serializing_date", () => {
    it("converts camelCase keys to snake_case", () => {
      const input = {
        userName: "John",
        emailAddress: "john@example.com",
        isActive: true,
      };

      const result = camel_to_snake_serializing_date(input);

      expect(result).toEqual({
        user_name: "John",
        email_address: "john@example.com",
        is_active: true,
      });
    });

    it("serializes Date objects to ISO string", () => {
      const date = new Date("2025-12-01T12:00:00.000Z");
      const input = {
        createdAt: date,
      };

      const result = camel_to_snake_serializing_date(input);

      expect(result).toEqual({
        created_at: "2025-12-01T12:00:00Z",
      });
    });

    it("handles nested objects with dates", () => {
      const date = new Date("2025-12-01T12:00:00.000Z");
      const input = {
        userData: {
          firstName: "John",
          createdAt: date,
        },
      };

      const result = camel_to_snake_serializing_date(input);

      expect(result).toEqual({
        user_data: {
          first_name: "John",
          created_at: "2025-12-01T12:00:00Z",
        },
      });
    });
  });
});

import { describe, it, expect } from "vitest";
import { handleDates } from "./handleDates";

describe("handleDates", () => {
  it("converts ISO datetime strings to Date objects", () => {
    const data = {
      createdAt: "2025-12-01T12:30:45Z",
      name: "Test",
    };

    const result = handleDates(data);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.name).toBe("Test");
  });

  it("converts date-only strings to Date objects", () => {
    const data = {
      date: "2025-12-01",
      amount: 100,
    };

    const result = handleDates(data);

    expect(result.date).toBeInstanceOf(Date);
    expect(result.amount).toBe(100);
  });

  it("handles nested objects", () => {
    const data = {
      expense: {
        date: "2025-12-01",
        createdTime: "2025-12-01T10:00:00Z",
      },
      total: 500,
    };

    const result = handleDates(data);

    expect(result.expense.date).toBeInstanceOf(Date);
    expect(result.expense.createdTime).toBeInstanceOf(Date);
    expect(result.total).toBe(500);
  });

  it("handles arrays of objects", () => {
    const data = [
      { date: "2025-12-01", name: "First" },
      { date: "2025-12-02", name: "Second" },
    ];

    const result = handleDates(data);

    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[1].date).toBeInstanceOf(Date);
  });

  it("returns primitives unchanged", () => {
    expect(handleDates(null)).toBe(null);
    expect(handleDates(undefined)).toBe(undefined);
    expect(handleDates(123)).toBe(123);
    expect(handleDates("text")).toBe("text");
  });

  it("does not convert non-date strings", () => {
    const data = {
      description: "Not a date",
      code: "ABC-123",
    };

    const result = handleDates(data);

    expect(result.description).toBe("Not a date");
    expect(result.code).toBe("ABC-123");
  });
});

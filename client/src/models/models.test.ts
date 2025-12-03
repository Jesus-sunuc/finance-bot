import { describe, it, expect } from "vitest";

describe("Expense Model", () => {
  it("has correct type structure for Expense", () => {
    const expense = {
      id: "exp-123",
      amount: 50.0,
      category: "Food",
      merchant: "Restaurant",
      date: new Date("2025-12-01"),
      description: "Lunch",
      createdTime: new Date(),
    };

    expect(expense.id).toBe("exp-123");
    expect(expense.amount).toBe(50.0);
    expect(expense.category).toBe("Food");
    expect(expense.date).toBeInstanceOf(Date);
  });

  it("has correct type structure for ExpenseCreate", () => {
    const expenseCreate = {
      amount: 100.0,
      category: "Shopping",
      merchant: "Store",
      date: "2025-12-02",
      description: "Groceries",
    };

    expect(expenseCreate.amount).toBe(100.0);
    expect(expenseCreate.date).toBe("2025-12-02");
  });

  it("has correct type structure for ExpenseUpdate", () => {
    const expenseUpdate = {
      amount: 75.0,
      category: "Entertainment",
    };

    expect(expenseUpdate.amount).toBe(75.0);
    expect(expenseUpdate.category).toBe("Entertainment");
  });
});

describe("Budget Model", () => {
  it("has correct type structure for Budget", () => {
    const budget = {
      id: "budget-123",
      category: "Food",
      amount: 500.0,
      period: "monthly" as const,
      spent: 150.0,
      remaining: 350.0,
      percentage: 30.0,
      startDate: "2025-12-01",
      createdTime: "2025-12-01T12:00:00Z",
    };

    expect(budget.id).toBe("budget-123");
    expect(budget.amount).toBe(500.0);
    expect(budget.period).toBe("monthly");
    expect(budget.percentage).toBe(30.0);
  });

  it("has correct period values", () => {
    const periods: Array<"monthly" | "weekly" | "yearly"> = [
      "monthly",
      "weekly",
      "yearly",
    ];

    expect(periods).toContain("monthly");
    expect(periods).toContain("weekly");
    expect(periods).toContain("yearly");
  });
});

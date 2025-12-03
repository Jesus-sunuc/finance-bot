import { describe, it, expect, vi } from "vitest";
import { showSuccessToast, showErrorToast, dismissToast } from "./toast";
import toast from "react-hot-toast";

vi.mock("react-hot-toast");

describe("toast utilities", () => {
  it("shows success toast with correct styling", () => {
    showSuccessToast("Operation successful");

    expect(toast.success).toHaveBeenCalledWith(
      "Operation successful",
      expect.objectContaining({
        duration: 3000,
        position: "top-right",
        style: expect.objectContaining({
          background: "#10B981",
          color: "#fff",
        }),
      })
    );
  });

  it("shows error toast with correct styling", () => {
    showErrorToast("Something went wrong");

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong",
      expect.objectContaining({
        duration: 4000,
        position: "top-right",
        style: expect.objectContaining({
          background: "#EF4444",
          color: "#fff",
        }),
      })
    );
  });

  it("dismisses toast by id", () => {
    dismissToast("toast-123");

    expect(toast.dismiss).toHaveBeenCalledWith("toast-123");
  });
});

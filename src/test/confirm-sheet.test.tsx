import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ConfirmSheet from "@/components/ConfirmSheet";

describe("ConfirmSheet", () => {
  it("cancels without confirming and confirms on request", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<ConfirmSheet isOpen onClose={onClose} onConfirm={onConfirm} title="Delete entry?" description="This cannot be undone." destructive />);
    expect(screen.getByText("Delete entry?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

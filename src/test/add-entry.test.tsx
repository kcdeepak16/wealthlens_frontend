import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddEntry from "@/pages/AddEntry";

const mutate = vi.fn();
vi.mock("@/hooks/useAccounts", () => ({
  useAccounts: () => ({
    isLoading: false,
    isError: false,
    data: [
      { id: 1, name: "Bank", type: "bank_account", date_of_start: "2025-01-01", consider_for_networth: true, metrics: [], current_value: 100, previous_value: 90, change_absolute: 10, change_percent: 11, sparkline: [] },
      { id: 2, name: "Fund", type: "mutual_fund", date_of_start: "2025-01-01", consider_for_networth: true, metrics: [], current_value: 200, previous_value: 180, change_absolute: 20, change_percent: 11, sparkline: [] },
    ],
  }),
}));
vi.mock("@/hooks/useSnapshot", () => ({
  useCreateSnapshot: () => ({ mutate, isPending: false }),
}));

describe("AddEntry", () => {
  beforeEach(() => mutate.mockClear());
  it("enables submit only when every account value is filled", async () => {
    render(<MemoryRouter><AddEntry /></MemoryRouter>);
    const submit = screen.getByRole("button", { name: /accounts remaining/i });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Bank current value"), "1000");
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Fund current value"), "2000");
    expect(screen.getByRole("button", { name: /Save Snapshot/i })).toBeEnabled();
  });
});

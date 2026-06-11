import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MetricToggle from "@/components/MetricToggle";
import TimeRangeSelector from "@/components/TimeRangeSelector";

describe("TimeRangeSelector", () => {
  it("renders all ranges and changes selection", async () => {
    const onChange = vi.fn();
    render(<TimeRangeSelector selected="1y" onChange={onChange} />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
    await userEvent.click(screen.getByRole("button", { name: "5Y" }));
    expect(onChange).toHaveBeenCalledWith("5y");
  });
});

describe("MetricToggle", () => {
  it("supports independent metric pills", async () => {
    const onToggle = vi.fn();
    render(<MetricToggle items={[
      { key: "value", label: "Value", color: "#000" },
      { key: "rate", label: "Rate", color: "#111" },
    ]} active={new Set(["value"])} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: "Rate" }));
    expect(onToggle).toHaveBeenCalledWith("rate");
  });
});

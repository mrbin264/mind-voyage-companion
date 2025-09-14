import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordResetRequestForm from "../PasswordResetRequestForm";
import { vi } from "vitest";

describe("PasswordResetRequestForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders email field and submit button", () => {
    render(<PasswordResetRequestForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows server error message", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ 
      ok: false, 
      json: async () => ({ message: "Invalid email address" }) 
    } as any);
    
    render(<PasswordResetRequestForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button");
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("shows success message on successful submit", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: true } as any);
    render(<PasswordResetRequestForm />);
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByText(/a reset link has been sent/i)).toBeInTheDocument();
    });
  });

  it("shows error message on failed submit", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, json: async () => ({ message: "Failed" }) } as any);
    render(<PasswordResetRequestForm />);
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });
});
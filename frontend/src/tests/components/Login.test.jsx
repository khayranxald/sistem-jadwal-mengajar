import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/auth/Login";
import * as authApi from "../../api/authApi";

// Mock authApi
vi.mock("../../api/authApi", () => ({
  login: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("renders login form", () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderLogin();

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
      expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
    });
  });

  it("successfully logs in with valid credentials", async () => {
    const mockResponse = {
      data: {
        user: { id: 1, nama: "Admin", role: "admin" },
        token: "fake-token",
      },
    };

    authApi.login.mockResolvedValueOnce(mockResponse);

    renderLogin();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    // Submit
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("shows error message on login failure", async () => {
    authApi.login.mockRejectedValueOnce({
      response: {
        data: { message: "Email atau password salah" },
      },
    });

    renderLogin();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    // Submit
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/email atau password salah/i)).toBeInTheDocument();
    });
  });

  it("disables submit button while loading", async () => {
    authApi.login.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    renderLogin();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    // Submit
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
  });

  it("toggles password visibility", () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole("button", { name: /toggle.*password/i });

    // Initially password type
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import axios from "../../api/axios";

// Mock axios
vi.mock("../../api/axios");

describe("Login Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("complete login to dashboard flow for admin", async () => {
    const mockLoginResponse = {
      data: {
        success: true,
        data: {
          user: {
            id: 1,
            nama: "Admin User",
            email: "admin@test.com",
            role: "admin",
          },
          token: "fake-jwt-token",
        },
      },
    };

    axios.post.mockResolvedValueOnce(mockLoginResponse);
    axios.get.mockResolvedValue({ data: { success: true, data: [] } });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should start at login page
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();

    // Fill login form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    // Submit login
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Should navigate to admin dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard admin/i)).toBeInTheDocument();
    });

    // Verify token was stored
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(localStorage.getItem("user")).toContain("admin@test.com");
  });

  it("complete login to dashboard flow for guru", async () => {
    const mockLoginResponse = {
      data: {
        success: true,
        data: {
          user: {
            id: 2,
            nama: "Guru User",
            email: "guru@test.com",
            role: "guru",
          },
          token: "fake-guru-token",
        },
      },
    };

    axios.post.mockResolvedValueOnce(mockLoginResponse);
    axios.get.mockResolvedValue({ data: { success: true, data: [] } });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Fill and submit login
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "guru@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Should navigate to guru dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard guru/i)).toBeInTheDocument();
    });
  });

  it("shows error on invalid credentials", async () => {
    const mockErrorResponse = {
      response: {
        status: 401,
        data: {
          success: false,
          message: "Email atau password salah",
        },
      },
    };

    axios.post.mockRejectedValueOnce(mockErrorResponse);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Fill and submit with wrong credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/email atau password salah/i)).toBeInTheDocument();
    });

    // Should remain on login page
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it("logout flow works correctly", async () => {
    // Setup logged in state
    localStorage.setItem("token", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        nama: "Admin",
        role: "admin",
      })
    );

    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Find and click logout button
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });

    // Token should be cleared
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("redirects to login when accessing protected route without token", () => {
    render(
      <BrowserRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </BrowserRouter>
    );

    // Should redirect to login
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });
});

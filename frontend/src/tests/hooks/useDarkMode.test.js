import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDarkMode from "../../hooks/useDarkMode";

describe("useDarkMode Hook", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove dark class from document
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("initializes with light mode by default", () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current[0]).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("reads initial value from localStorage", () => {
    localStorage.setItem("darkMode", "true");

    const { result } = renderHook(() => useDarkMode());

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles dark mode on", () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("darkMode")).toBe("true");
  });

  it("toggles dark mode off", () => {
    // Start with dark mode on
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");

    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("darkMode")).toBe("false");
  });

  it("toggles between dark and light mode multiple times", () => {
    const { result } = renderHook(() => useDarkMode());

    // Toggle on
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);

    // Toggle off
    act(() => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe(false);

    // Toggle on again
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
  });

  it("persists preference across renders", () => {
    const { result, rerender } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1](true);
    });

    rerender();

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem("darkMode")).toBe("true");
  });
});

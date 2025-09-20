// Global error suppression for Text component errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Check if this is the Text component error
  const message = args[0]?.toString() || "";
  if (
    message.includes("Text strings must be rendered within a <Text> component")
  ) {
    // Suppress this specific error
    console.warn("Suppressing Text component error:", ...args);
    return;
  }
  // Call original console.error for other errors
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  // Check if this is the Text component warning
  const message = args[0]?.toString() || "";
  if (
    message.includes("Text strings must be rendered within a <Text> component")
  ) {
    // Suppress this specific warning
    return;
  }
  // Call original console.warn for other warnings
  originalConsoleWarn.apply(console, args);
};

export {};

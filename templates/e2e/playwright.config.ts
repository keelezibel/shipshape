// Copy to apps/web/e2e/../playwright.config.ts (or apps/web root). Runs mobile viewport FIRST
// (this repo is mobile-first), then desktop. Starts app servers automatically via webServer.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // no test.only left behind
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry", // full trace for CI failure triage
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    // Uncomment when the app has a Python backend:
    // {
    //   command: "cd ../api && uv run uvicorn app.main:app --port 8000",
    //   url: "http://localhost:8000/health",
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120_000,
    // },
  ],
});

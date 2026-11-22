import { defineConfig, devices } from '@playwright/test'

const fumee = ['e2e/smoke.spec.ts']

export default defineConfig({
  testDir: 'tests',
  testMatch: ['e2e/**/*.spec.ts', 'headers/**/*.spec.ts', 'a11y/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build && node tests/support/serve.mjs',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['a11y/mobile.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      testMatch: ['a11y/**/*.spec.ts'],
      use: { ...devices['Pixel 7'] },
    },
    { name: 'webkit', testMatch: fumee, use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', testMatch: fumee, use: { ...devices['Desktop Firefox'] } },
    { name: 'edge', testMatch: fumee, use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
})

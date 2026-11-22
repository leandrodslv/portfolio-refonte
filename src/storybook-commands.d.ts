import 'vitest/browser'

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulerMedia: (options: {
      contrast?: 'more' | 'no-preference'
      forcedColors?: 'active' | 'none'
    }) => Promise<void>
  }
}

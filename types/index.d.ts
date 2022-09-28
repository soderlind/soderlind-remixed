export {};

declare global {
  interface Window {
    ENV: any; // 👈️ turn off type checking
  }
}

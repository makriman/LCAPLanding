import { defineConfig } from "astro/config";

// Applied by `astro dev` and `astro preview`. Static hosts should mirror these
// via public/_headers. frame-ancestors is ignored in a meta CSP, so the header
// copy is what actually blocks framing.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://static-files.aspora.com",
  "img-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": contentSecurityPolicy,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default defineConfig({
  site: "https://aspora.example",
  security: {
    checkOrigin: true,
  },
  server: {
    headers: securityHeaders,
  },
});

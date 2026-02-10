# URL and redirect policy

- **Trailing slash:** Handled by Astro (`trailingSlash: 'never'`). All canonical and internal URLs use no trailing slash (e.g. `https://obdfaultcode.com/en`, `/en/contact`).
- **HTTP/HTTPS and www:** Handled by Cloudflare (e.g. “Redirect from HTTP to HTTPS” template). Do not duplicate this in the app or in `public/_redirects`.
- **No extra redirect rules:** Do not add redirects in Astro (e.g. `Astro.redirect`) or in `_redirects` that could cause redirect loops. The only redirects in the app are the root `index.astro` client-side language choice (`/` → `/tr` or `/en`) and the 404 redirects in `[slug].astro` for unknown codes.
- **Canonical:** Always `https://obdfaultcode.com` + path, no trailing slash, no www. See `src/lib/i18n.ts` (`getCanonicalUrl`, `CANONICAL_BASE`).

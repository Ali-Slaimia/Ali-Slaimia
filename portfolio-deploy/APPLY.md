# Copy into Ali-Slaimia/Portfolio before redeploy

| File here | Copy to Portfolio repo |
|-----------|------------------------|
| `src/data/portfolio.ts` | `src/data/portfolio.ts` |
| `netlify.toml` | repo root |
| `next.config.ts` | repo root |
| `_redirects` | `public/_redirects` |

Then: `git add -A && git commit -m "Update live links and Netlify deploy config" && git push`

Netlify build settings: command `npm run build`, publish directory `out`.

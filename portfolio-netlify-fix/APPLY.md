# Apply these files to Ali-Slaimia/Portfolio

Copy into the Portfolio repo root:

- `netlify.toml` → repo root
- `next.config.ts` → replace existing
- `_redirects` → `public/_redirects`

Then commit, push to `main`, and Netlify will redeploy automatically.

If you still see a 404, open Netlify → Site configuration → Build settings and set:
- Build command: `npm run build`
- Publish directory: `out`

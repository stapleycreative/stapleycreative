<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Build & deploy rules (don't break these)

## 1. Build-time packages go in `dependencies`, not `devDependencies`.
Vercel builds run with `NODE_ENV=production`, which strips devDependencies. If the build needs it, it's a runtime dep. This includes PostCSS plugins, Tailwind, MDX processors, anything imported by config files. Types-only packages (`@types/*`), linters, and test frameworks can stay in devDeps.

## 2. Libraries that touch `window` or `document` must be dynamic-imported with `ssr: false`.
Static prerendering runs in Node. Any module that accesses browser globals at import time (Lottie, canvas libs, some animation libs) will crash the build. Wrap them:
```tsx
"use client";
import dynamic from "next/dynamic";
const Thing = dynamic(() => import("lib").then(m => m.Thing), { ssr: false });
```

## 3. Run `npm run build` before pushing.
The pre-push hook does this automatically on `main`. Don't bypass it with `--no-verify` unless you know why. CI (`.github/workflows/build.yml`) also runs the same build on every push as a backstop.

## 4. If the live site looks stale, check Vercel deployments.
`gh api repos/stapleycreative/stapleycreative/deployments --jq '.[0:5] | .[] | {sha: .sha[0:7], created_at}'` shows recent deploys. Then `gh api repos/.../deployments/<id>/statuses` for the status. Silent deploy failures happened for 6 days once — don't assume "pushed = shipped".

# Contributing

Thanks for taking an interest in **Lumenfolio** — a dynamic CMS for software, art, writing, and experience on one site.

1. Open a branch from `main`: `<type>/<scope>/<short-description>` (for example `fix/public/contact-form`).
2. Keep changes focused. Conventional Commits (`feat(public): …`, `fix(api): …`).
3. Never commit `.env`, `.env.local`, Firebase private keys, or ImageKit secrets.
4. Run the checks that match what you touched:

```bash
cd frontend && npm run typecheck && npm test
cd backend && npm run typecheck && npm test
```

5. Update `README.md`, `docs/SETUP.md`, `docs/architecture.md`, or `docs/api.md` if you change setup, env, layers, or HTTP routes.

Source code is the source of truth. Sample CMS copy is fictional (Riley Navarro / example.com) so forks can replace it via Admin or `npm run seed:firebase-content`.

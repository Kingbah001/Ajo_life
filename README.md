# Ajo (React + Tailwind)

Savings wallet with ajo/esusu-style circles. Vite, React 18, Tailwind CSS v4, no router or state library.

    npm install
    npm run dev       # local dev server
    npm run build     # production build in dist/

## Structure
- `src/lib/provider.js` — the mock money layer. The only place balances and payments change. Replace it with a real API client later.
- `src/lib/nav.jsx` — navigation stack (`go`, `back`, `replace`, `reset`). Tabs reset the stack, other screens push.
- `src/lib/user.jsx` — name, phone and transaction PIN.
- `src/lib/notify.jsx` — notification list plus `notify(kind, title, sub, go)`, which respects the per-kind switches stored in the user context.
- `src/lib/wallet.jsx` — context that loads from the provider and exposes `addMoney` / `payCircle`.
- `src/lib/toast.jsx`, `useCountUp.js`, `useDigits.js`, `format.js` — small shared helpers.
- `src/components/` — `Guilloche` (pointer-reactive banknote pattern), `Rings`, `TabBar`, `Keypad` (with `PinDots`), `Header`.
- `src/screens/` — one file per screen. `Home` is ported. `Placeholder` stands in for the rest.
- `src/index.css` — design tokens (light/dark via CSS variables) mapped into Tailwind's theme.

## Porting status
Every screen from the prototype is ported: Home, Send, Goals (save and new goal), Activity, Request, Circles (list, detail, chat, start, join, waiting page, rounds, payout day), Notifications, Profile (with PIN change, bank accounts and help) and Onboarding.
The app opens on Onboarding. The single-file version it was ported from is kept in `reference/ajo-prototype.html`.

## Demo notes
- Everything is mock data held in memory, so a reload resets the app.
- Onboarding code: 123456. Default PIN until you create one: 1234.
- Join codes: AJO-3580 and AJO-7305.

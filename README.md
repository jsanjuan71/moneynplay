# Money n Play

A modern Next.js application with TypeScript, featuring Material UI, Tailwind CSS, dark/light mode, multi-language support, and Convex backend.

**Money n Play** is a fun, educational finance app for kids (ages 6–14) where parents can add real money, while kids make decisions with it inside a safe, gamified environment. Kids learn financial habits through missions, simulations, avatars, stories, and interactive dashboards.

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Choose your path and start building!
- **[Architecture & Roadmap](./docs/ARCHITECTURE.md)** - Complete technical overview

## Features

### 🎯 App Concept
- **For Parents**: Add real money, approve actions, set allowances, track progress
- **For Kids**: Make financial decisions, earn virtual coins, complete missions, customize avatars
- **Safe Environment**: Real money non-withdrawable, parent approval required, COPPA-minded
- **Educational**: Learn through gamification, missions, videos, and interactive stories

### 🛠️ Tech Stack

- ✅ **Next.js 15** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for utility-first styling
- ✅ **Material UI (MUI)** for beautiful React components
- ✅ **Dark/Light Mode** toggle with persistent theme
- ✅ **Internationalization (i18n)** with English and Spanish support using next-intl
- ✅ **Convex Backend** for real-time data synchronization

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

1. Start the Convex backend (in a separate terminal):
```bash
npx convex dev
```

2. Run the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to the English version at `/en`.

### Available Routes

- `/en` - English version
- `/es` - Spanish version (Español)

## Project Structure

```
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── layout.tsx         # Main layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── ConvexClientProvider.tsx
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── ThemeToggle.tsx        # Dark/Light mode switcher
│   └── LanguageSwitcher.tsx   # Language selector
├── contexts/
│   └── ThemeContext.tsx       # Theme context provider
├── convex/
│   └── example.ts             # Example Convex query
├── i18n/
│   ├── request.ts             # i18n configuration
│   └── routing.ts             # Routing configuration
├── messages/
│   ├── en.json                # English translations
│   └── es.json                # Spanish translations
└── middleware.ts              # Next.js middleware for i18n
```

## Key Technologies

### Theme Management
The app uses Material UI's theming system with a custom `ThemeProvider` that persists the user's preference in localStorage.

### Internationalization
Powered by `next-intl`, the app supports:
- Automatic locale detection
- URL-based locale switching (`/en`, `/es`)
- Translation files in JSON format
- Type-safe translation keys

### Convex Backend
Convex provides:
- Real-time data synchronization
- Type-safe database queries
- Serverless functions
- Authentication (ready to implement)

## Customization

### Adding a New Language

1. Add locale to `i18n/routing.ts`:
```typescript
export const routing = defineRouting({
  locales: ['en', 'es', 'fr'], // Add 'fr'
  defaultLocale: 'en'
});
```

2. Create translation file `messages/fr.json`

3. Update the language switcher in `components/LanguageSwitcher.tsx`

### Customizing Theme

Edit `contexts/ThemeContext.tsx` to modify colors and typography:

```typescript
const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#your-color', // Customize
        },
      },
    }),
  [mode]
);
```

## Using Convex

Example query in `convex/example.ts`:

```typescript
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async () => {
    return "Hello from Convex!";
  },
});
```

Use in components:
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const message = useQuery(api.example.get);
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI](https://mui.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Convex](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy!

### Deploy Convex

Convex is automatically deployed when you run:
```bash
npx convex deploy
```

## License

MIT

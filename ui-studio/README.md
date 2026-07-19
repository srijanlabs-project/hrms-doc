# Staffsy UI Studio

This workspace turns the current HRMS mockup library into a runnable screen studio for design review and developer handoff.

## What It Includes

- React + Vite app for browsing the screen library
- Auto-generated screen registry from `D:\HRMS-doc\docs\10-ui-ux-architecture\mockups`
- Family-based filtering across the current mockup set
- Desktop and mobile preview switching per screen
- Design-system aligned shell for future conversion from mockup-backed previews to coded production screens

## Local Commands

```bash
pnpm install
pnpm dev
pnpm build
```

## How It Works

`scripts/generate-screens.mjs` scans the mockup folder and generates `src/data/screens.generated.ts`.

Each screen record includes:

- screen reference
- title
- family key
- family label
- desktop asset
- mobile asset

## Current Intent

This is the implementation studio for the screen system, not the final HRMS product UI runtime yet.

The current phase gives the team:

- one place to review every designed screen
- a typed registry that development can build against
- a base app shell already aligned with the Staffsy design language

## Next Extension Path

Convert screen families from static SVG-backed previews into coded page implementations in this order:

1. Wave 0 Platform and Org Admin
2. Employee and Manager self-service
3. HR operations and people record
4. Payroll, leave, documents, recruitment
5. Analytics, AI assistant, and specialist modules

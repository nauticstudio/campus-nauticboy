# Operating Rules (L0-Governance)

## Overview
This document defines the baseline operating rules, coding standards, and architectural constraints for the Nautic Campus repository. It acts as the ultimate authority on how implementation must be executed.

## 1. Architectural Rules
- **Framework Constraint**: The application MUST be built using Next.js App Router.
- **Client/Server Boundary**: Client components and server logic MUST remain separated. Server Actions must be encapsulated in `src/app/actions/`.
- **Styling Constraint**: All styling MUST use Tailwind CSS v4 utility classes. Raw CSS modules or inline styles are prohibited unless explicitly required for external library integration.
- **Database Operations**: Database schemas MUST be defined via raw SQL files located in the `supabase/` directory.

## 2. Coding Standards
- **Language**: All new code MUST be written in TypeScript. Existing JavaScript files at the root level are considered legacy tech debt.
- **Form Validation**: Form state and validation MUST be handled using `react-hook-form` and `zod`.
- **UI Components**: UI elements MUST be constructed using the established component system (Shadcn UI / `@base-ui/react`) located in `src/components/`.

## 3. Evidence & Constraints
*The following sections require clarification or lack repository evidence.*

### [UNKNOWN] CI/CD and Deployment Rules
- Evidence for deployment environments (e.g., Vercel, AWS) is missing.
- Mandatory pre-deployment checks (e.g., testing suites, build checks) are undocumented.

### [UNKNOWN] Branching Strategy
- No evidence exists outlining Git workflows, branch naming conventions, or pull request review policies.

### [UNKNOWN] Secret Management
- Handling of environment variables beyond `.env.local` is currently undocumented.

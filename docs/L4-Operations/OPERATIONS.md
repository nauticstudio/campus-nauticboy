# Operations & Deployment (L4-Operations)

## Overview
This document outlines the infrastructure, deployment, and operational procedures for Nautic Campus.

## 1. Build & Run
- **Development**: `npm run dev` (uses `next dev --webpack`)
- **Build**: `npm run build` (uses `next build --webpack`)
- **Start**: `npm run start` (uses `next start`)

## 2. Environment Variables
- Required configuration resides in `.env.local` for development.
- Verified required keys include Supabase configuration (e.g., `NEXT_PUBLIC_SUPABASE_URL`).

## 3. Database Migrations
- Executed manually via raw SQL scripts located in the `supabase/` directory (e.g., `software_schema.sql`).

## 4. Unknowns & Missing Procedures

### [UNKNOWN] Deployment Platform
- The production hosting environment (e.g., Vercel, AWS, Railway) is currently undocumented and unverified.

### [UNKNOWN] CI/CD Pipeline
- No Continuous Integration or Continuous Deployment workflows (e.g., GitHub Actions) are documented or present in the repository.

### [UNKNOWN] Production Secrets
- The mechanism for managing production secrets for Google Drive API and Supabase Admin roles is undocumented.

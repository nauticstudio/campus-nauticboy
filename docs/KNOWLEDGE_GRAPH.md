# Knowledge Graph (L5-Knowledge)

## Overview
This document maps the relationships between core concepts, domains, and entities within the Nautic Campus repository. It helps AI agents and developers understand how different parts of the system interact.

## 1. Domain Entities & Relationships

### Software Distribution Domain
- **Manufacturer (Fabricante)**: The top-level brand or creator (e.g., reFX, Native Instruments).
  - *Has many* -> **Products**
- **Product (Sintetizador / VST)**: A specific software instrument or effect (e.g., Nexus 5, Serum).
  - *Belongs to* -> **Manufacturer**
  - *Has many* -> **Items**
- **Item (Expansión / Instalador / Presets)**: The actual downloadable file or resource linked to a Product.
  - *Belongs to* -> **Product**
  - *Served via* -> **Google Drive Integration**

### User Domain
- **Profile**: Represents a registered user.
  - *Has role* -> `admin` or `student`
  - *Has access to* -> **Courses** and **Software** based on role/subscription.

## 2. Technical Dependencies (Subsystems)

### A. Frontend Application (Next.js)
- **`(campus)` Route Group**: Handles all authenticated user interfaces (Dashboard, Software Library).
- **`(auth)` Route Group**: Handles authentication flows (Login, Register).
- **Server Actions (`src/app/actions`)**: Encapsulates all data mutation logic (Creates, Updates, Deletes) allowing client components to interact with the database securely without building standard API routes.

### B. Data & Identity (Supabase)
- **Supabase Auth**: Manages user sessions and identity.
- **Supabase Postgres**: Stores all domain entities via raw SQL schemas located in the `supabase/` directory.

### C. File Storage (Google Drive)
- **`src/lib/google-drive`**: Acts as a secure proxy or retrieval system to serve large software binaries/expansions directly from Google Drive to authenticated users, avoiding massive bandwidth costs on the main deployment server.

## 3. Unknowns & Unverified Relationships
- **[UNKNOWN] Payment / Subscription Gateway**: There is no documented or discovered mapping for how users purchase access (e.g., Stripe, PayPal).
- **[UNKNOWN] Course Domain Structure**: While "Courses" exist as a concept, the specific database tables and video hosting mechanism (e.g., Vimeo, YouTube, AWS S3) are unmapped due to lack of explicit documentation.

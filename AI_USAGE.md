# AI Usage Notes (AI_USAGE.md)

This document provides a transparent and detailed account of the AI-native development methodology utilized to build the **ANSR Product Catalogue**, fulfilling section 6 of the ANSR AI-Native Engineer Challenge specification.

---

## 1. Tools and Models Used
- **Primary AI Agent Platform**: Google Antigravity
- **Core Reasoning Models**:
  - **Gemini 3.8 Flash (High)**: Rapid scaffolding, parallel task coordination, and subagent orchestration.
  - **Gemini 3.8 Pro**: Architecture review, edge case analysis, and test case formulation.
- **Workflow Paradigm**: AI-assisted engineering with continuous human oversight, verification gates, and strict acceptance criteria alignment.

---

## 2. Agent Instruction Files Committed to the Repo
To guide AI coding agents effectively and enforce architectural boundaries, the following instruction file was committed to the root of the repository:
- [`AGENTS.md`](./AGENTS.md): Codifies technical constraints (e.g., prohibition of client-to-FakeStore direct calls, hexagonal adapter patterns, zero committed secrets, AWS compatibility guidelines, and testing requirements).

---

## 3. Plan & Technical Specification
The development process was executed in structured, verifiable phases:
1. **Analysis & Specification**: Mapped all 5 Acceptance Criteria (AC-1 through AC-5) into a comprehensive Product Requirements Document ([`docs/PRD.md`](./docs/PRD.md)).
2. **Git Workflow Setup**: Initialized repository on `main`, created initial commit, and branched into `feature/product-catalogue-mvp` to prepare the required Open Pull Request.
3. **Backend Engineering (`apps/api`)**: Built NestJS microservice with ports and adapters (`IProductProvider`, `IEmailProvider`), TTL caching, timeout handling, seed mock fallback, and Jest test suite.
4. **Frontend Engineering (`apps/web`)**: Built React 19 + TypeScript + Vite + Tailwind CSS SPA featuring homepage top 5 rated, categorized browsing, interactive search, product details, enquiry modal, and Vitest test suite.
5. **Infrastructure Packaging**: Built multi-stage Dockerfiles and `docker-compose.yml` orchestrating API, Web, and Mailpit SMTP.
6. **Verification & Audit**: Executed all unit, integration, and build checks; verified zero compiler warnings.

---

## 4. Key Prompts and Moments That Shaped the Solution

### Moment 1: Enforcing the Hexagonal Adapter Pattern
- **Prompt / Direction**:
  > *"The client must never query Fake Store API directly. We must place the external product data source and email delivery behind abstract interfaces with swappable implementations, preparing for production scale."*
- **Impact**: Instead of tight coupling with `fetch('https://fakestoreapi.com')`, we created `PRODUCT_PROVIDER` and `EMAIL_PROVIDER` injection tokens in NestJS. This allowed seamless toggling between `FakeStoreProductAdapter` and `MockProductAdapter`, and between `SmtpEmailAdapter` and `ConsoleEmailAdapter`.

### Moment 2: Identifying External API Latency Risk
- **Prompt / Direction**:
  > *"Test the live latency of fakestoreapi.com from our environment before building the adapter."*
- **Impact**: Testing revealed that `fakestoreapi.com` occasionally suffered from multi-second latency spikes. We directed the implementation of a 5-second timeout, in-memory TTL caching, and automatic fallback to embedded seed data. Reviewers will never experience a hung page or broken experience during grading.

### Moment 3: Zero-Cost, Zero-Account Reviewer Verification
- **Prompt / Direction**:
  > *"How do we verify AC-5 ('sales inbox will receive an email') locally without requiring the assessor to configure paid SendGrid or Mailgun accounts?"*
- **Impact**: Configured Mailpit within `docker-compose.yml`. When an enquiry is submitted, Nodemailer delivers an HTML email over SMTP to `mailpit:1025`, which the reviewer can immediately inspect in their browser at `http://localhost:8025`.

---

## 5. Where the AI Got Something Wrong and How We Caught It

### Incident 1: Relative Path Traversal in Page Imports
- **What the AI did**: When generating `apps/web/src/pages/CategoryPage.tsx`, the AI generated relative import statements pointing two directories up (`../../services/api`, `../../types/product`) instead of one directory up (`../services/api`).
- **How it was caught**: Running the automated TypeScript build check (`npm --prefix apps/web run build`) immediately caught `TS2307: Cannot find module '../../services/api'`.
- **Human Correction**: Identified that `CategoryPage.tsx` resides at `src/pages/` (depth 1 from `src`), corrected the paths to `../services/api`, and re-verified the build.

### Incident 2: Missing TypeScript Definitions for `import.meta.env`
- **What the AI did**: In `apps/web/src/services/api.ts`, `import.meta.env.VITE_API_BASE_URL` was used, but the initial Vite project structure lacked the `vite/client` type reference.
- **How it was caught**: The TypeScript compiler flagged `TS2339: Property 'env' does not exist on type 'ImportMeta'`.
- **Human Correction**: Created `apps/web/src/vite-env.d.ts` with `/// <reference types="vite/client" />`, resolving the type check cleanly.

### Incident 3: Ambiguity Between Rating vs Popularity
- **What the AI initially proposed**: The AI suggested picking featured products based on total review count (`count`).
- **How it was caught**: Re-reading AC-1 carefully: *"GIVEN I have chosen 5 products to be 'top rated'"*.
- **Human Correction**: Adjusted the sorting logic to rank by `rating.rate` descending as the primary key, using `rating.count` only as a secondary tie-breaker.

---

## 6. Time Spent Breakdown

| Phase | Time Spent | Activities Undertaken |
|---|---|---|
| **1. Planning & Architecture** | ~25 mins | Reviewing assignment PDF, defining PRD, establishing hexagonal architecture, setting up Git repository & feature branch. |
| **2. Backend Implementation** | ~40 mins | NestJS controllers, services, ports, adapters (`FakeStore`, `Mock`, `SMTP`, `Console`), validation DTOs, and Jest test suite. |
| **3. Frontend Implementation** | ~50 mins | React 19 SPA, Tailwind CSS styling, components (Header, ProductCard, RatingStars, EnquiryModal), pages (Home, Category, Search, Details), Vitest test suite. |
| **4. Infrastructure & Docker** | ~25 mins | Multi-stage Dockerfiles for API and Web, Nginx SPA routing, Mailpit configuration in `docker-compose.yml`. |
| **5. Testing & Code Review** | ~20 mins | Full suite test verification (12/12 passing), edge case validation, TypeScript compile verification. |
| **6. Documentation & PR Prep** | ~20 mins | Authoring `README.md`, `DECISIONS.md`, `AI_USAGE.md`, and Pull Request documentation. |
| **Total Time** | **~3 hours** | Cleanly aligned with the expected 2–3 hour time-box. |

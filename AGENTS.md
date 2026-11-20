# AGENTS.md — AI Agent Guidance & Coding Directives

This document provides context, architectural constraints, and engineering guidelines for AI coding agents (such as Google Antigravity and Google Gemini) working on the **ANSR Product Catalogue** repository.

---

## 1. Project Context & Objectives
- **Client**: ANSR AI-Native Engineer Take-Home Challenge.
- **Goal**: Deliver a scalable, production-grade Product Catalogue MVP built with AI assistance, demonstrating architectural rigor, clean code separation, test coverage, and clear human oversight.
- **Core Requirement**: The MVP must not be a throwaway prototype. It must be architected so data sources, email providers, and UI layers can be swapped or extended without breaking core domains.

---

## 2. Hard Architectural Constraints
1. **No Direct Client-to-External API Calls**:
   - The React client must NEVER call the Fake Store API (or any external third-party API) directly.
   - All product, category, and enquiry requests MUST pass through the backend NestJS API (`apps/api`).
2. **Ports and Adapters (Hexagonal Architecture)**:
   - External dependencies (Product catalog data, Email delivery) must be placed behind abstract interfaces (`ProductProvider`, `EmailProvider`).
   - If Fake Store API is slow or unavailable, a graceful fallback to a local mock catalog must occur without crashing the system.
   - For email delivery, an SMTP adapter (targeting Mailpit for local testing) and a Console fallback adapter must be supported.
3. **No Hardcoded Secrets or Paid Services**:
   - Configuration must load from environment variables (`.env`).
   - Reviewers must be able to run everything locally without external accounts or payment.
4. **AWS Compatibility**:
   - Containerized services must remain stateless and deployable to standard AWS services (ECS / Fargate / App Runner, S3 + CloudFront, SES).

---

## 3. Tech Stack Standards
- **Monorepo**: npm workspaces (`apps/api`, `apps/web`).
- **Backend (`apps/api`)**:
  - NestJS 11+ with TypeScript.
  - Strict input validation via `class-validator` and `class-transformer`.
  - In-memory TTL caching for product catalog resilience.
  - Global HTTP exception filter and request logging.
  - Comprehensive unit and integration tests using Jest.
- **Frontend (`apps/web`)**:
  - React 19 / 18 with TypeScript and Vite.
  - Tailwind CSS for responsive, modern UI design.
  - React Router v6+ for client-side routing.
  - Lucide React for consistent icons.
  - Accessible, semantic markup with loading skeletons and empty states.
- **Infrastructure**:
  - Multi-stage Dockerfiles for both Web and API.
  - `docker-compose.yml` orchestrating `api`, `web`, and `mailpit`.

---

## 4. Coding Standards for AI Agents
- **TypeScript**: Always enable strict mode. Avoid `any` types; define explicit interfaces and DTOs.
- **Error Handling**: Use structured error responses with HTTP status codes and actionable messages.
- **Component Design**: Keep UI components modular, reusable, and single-purpose. Separate presentation from data-fetching hooks.
- **Testing**:
  - Test critical paths: featured product selection, category filtering, search query handling, enquiry validation, and email dispatch.
  - Mock external network calls in unit tests.

# Pull Request Description: Scalable Product Catalogue MVP (ANSR AI-Native Challenge)

> **Branch**: `feature/product-catalogue-mvp` -> `main`  
> **Author**: Arun Singh  
> **Submission Date**: November 2026

---

## 📌 Summary of Changes
This PR implements the complete **Scalable Product Catalogue MVP** for the ANSR AI-Native Engineer Challenge. Sourced from the Fake Store API, the application provides a modular, extensible foundation designed for long-term growth using Hexagonal Architecture (Ports & Adapters).

All product requests are strictly mediated by our NestJS backend; the React client never communicates directly with external APIs.

---

## 🎯 Acceptance Criteria Verification

- [x] **AC-1 (Home Page Top 5 Rated)**:
  - Backend endpoint `GET /api/products/featured?limit=5` dynamically ranks products by `rating.rate` descending.
  - Homepage showcases the 5 featured products with ranking badges (`Top #1` to `Top #5`).
- [x] **AC-2 (Category Page Partitioning)**:
  - Backend endpoint `GET /api/categories/:category` partitions items into `topRated` (ratings >= 4.0) and `additional`.
  - Frontend renders distinct sections: **"Top Rated in [Category]"** and **"Additional Products in [Category]"**.
- [x] **AC-3 (Product Search)**:
  - Search bar in header with an explicit **Search** button and `Enter` key support.
  - Matches case-insensitive queries across `title` and `description`, with an empty-state screen if no items match.
- [x] **AC-4 (Product Details Page)**:
  - Clicking any product card navigates to `/products/:id` displaying high-res photos, star ratings, review count, stock availability, and specs.
- [x] **AC-5 (Enquiry Form & Email Notification)**:
  - "Enquire About This Product" CTA opens an enquiry modal with form validation.
  - Submitting dispatches an automated HTML email via SMTP to the sales inbox (viewable in Mailpit).
  - Displays an immediate customer confirmation card with unique reference ID (`ENQ-XXXX`) and turnaround time.

---

## 🏗️ Architecture & Extensibility Highlights

1. **Hexagonal Architecture (Ports and Adapters)**:
   - `IProductProvider`: Decouples product data source. Configured with `FakeStoreProductAdapter` with in-memory TTL caching and timeout fallback to `MockProductAdapter`.
   - `IEmailProvider`: Decouples notifications. Implemented with `SmtpEmailAdapter` (targeting Mailpit) and `ConsoleEmailAdapter`.
2. **Reviewer Experience**:
   - Zero paid accounts or external API keys needed.
   - Run in under 10 minutes via `docker compose up --build`.
   - Mailpit web interface available at `http://localhost:8025` to inspect sent enquiry emails.
3. **AWS Compatibility**:
   - Stateless containerized services ready for AWS ECS / Fargate, App Runner, S3 + CloudFront, and SES.

---

## 🧪 Test Coverage
Monorepo tests execute with `npm run test`:
- **Backend (Jest)**: 10 unit and service tests covering ranking, category partitioning, search, and enquiry dispatch.
- **Frontend (Vitest)**: Component tests covering product card display, form validation, and thank-you confirmation.
- **Total**: 12 / 12 tests passing.

---

## 📖 Supporting Documentation Included in Repo
- [`README.md`](./README.md): Quickstart setup, tech stack justification, and verification instructions.
- [`DECISIONS.md`](./DECISIONS.md): Assumptions where criteria were unclear, simplified requirements, extensibility design, and future roadmap.
- [`AI_USAGE.md`](./AI_USAGE.md): AI tools & models used (Antigravity & Gemini), key shaping prompts, AI mistakes & human reviews, and detailed time breakdown.
- [`AGENTS.md`](./AGENTS.md): AI agent instructions and architectural directives.
- [`docs/PRD.md`](./docs/PRD.md): Product Requirements Document.

---

## 🚀 How to Review & Test Locally
```bash
# 1. Build and start all services (Web on :3000, API on :3001, Mailpit on :8025)
docker compose up --build

# 2. Run automated test suites
npm run test
```

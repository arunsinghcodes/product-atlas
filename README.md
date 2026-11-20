# Product Atlas — Product Discovery Platform
> Discover products. Explore possibilities. Connect with sellers.

[![Tests](https://img.shields.io/badge/tests-12%2F12%20passing-brightgreen)](#running-tests)
[![Architecture](https://img.shields.io/badge/architecture-hexagonal%20%2F%20ports%20%26%20adapters-blue)](#architecture--design)
[![Docker](https://img.shields.io/badge/docker-ready-2496ed?logo=docker)](#quick-start-under-10-minutes)
[![Repository](https://img.shields.io/badge/github-arunsinghcodes%2Fproduct--atlas-black?logo=github)](https://github.com/arunsinghcodes/product-atlas)

---

## Overview
**Product Atlas** is an enterprise-grade, AI-native product discovery and enquiry web application built for the **ANSR AI-Native Engineer Challenge**. 

Designed for an entrepreneur validating an e-commerce concept, Product Atlas treats the prototype as a scalable foundation rather than a throwaway artifact. The client **never** interacts directly with third-party APIs (such as Fake Store API). All catalog ingestion, category partitioning, text search, and enquiry workflows route strictly through a modular NestJS backend leveraging **Hexagonal Architecture (Ports & Adapters)** with in-memory TTL caching and graceful fallback.

---

## Tech Stack & Architectural Justifications

| Layer | Selection | Justification & Architectural Benefit |
|---|---|---|
| **Client** | **React 19 + TypeScript + Vite + Tailwind CSS** | Component modularity, type safety, sub-second HMR development speed, accessible UI, and zero bloated runtime dependencies. Fully responsive across desktop, tablet, and mobile. |
| **Backend** | **Node.js (NestJS 11) + TypeScript** | Enterprise dependency injection framework that cleanly implements **Hexagonal Architecture (Ports and Adapters)**. Built-in DTO validation (`class-validator`), unified exception filters, and request logging. |
| **Product Provider** | **`IProductProvider` (FakeStore & Mock Fallback)** | Clean abstraction over catalog sources. Includes an in-memory TTL cache and 5s timeout fallback to avoid external API latency spikes. Swappable with Shopify, PostgreSQL, or Algolia without altering controllers. |
| **Email Delivery** | **`IEmailProvider` (Nodemailer SMTP & Console)** | Direct enquiry notification routing. Targets local **Mailpit** SMTP for zero-cost assessor verification. Swappable with AWS SES or SendGrid for production. |
| **Testing** | **Jest (Backend) + Vitest (Frontend)** | 12 automated unit and integration tests verifying all 5 core acceptance criteria. |
| **Containers** | **Docker & Docker Compose** | Multi-stage Dockerfiles enabling a single-command setup in under 10 minutes. |

---

## Acceptance Criteria Mapping

| ID | Acceptance Criteria (PDF Spec) | Status | Verification in Product Atlas |
|---|---|---|---|
| **AC-1** | **Featured Products**: GIVEN I have chosen 5 products to be "top rated" WHEN I am viewing the home page THEN I see those 5 featured products | ✅ Covered | Homepage displays top 5 products sorted descending by `rating.rate` with `Top #1` through `Top #5` badges. |
| **AC-2** | **Category Page**: GIVEN my products are organised into categories WHEN I click on a category link THEN I see top rated products for that category AND I see additional products in that category | ✅ Covered | Navigating to `/categories/:category` renders two distinct sections: **"Top Rated in [Category]"** (`rate >= 4.0`) and **"Additional Products in [Category]"**. |
| **AC-3** | **Search**: GIVEN I am looking for a specific product AND I have entered a search term in the search bar WHEN I click the search button THEN I only see products that have text matching that search term | ✅ Covered | Search bar with dedicated **Search** button (and Enter key) filters items by text across title and description. |
| **AC-4** | **Product Details**: GIVEN I am browsing the products AND I want to see more details about a specific product WHEN I click on a product tile THEN I see the product details page | ✅ Covered | Clicking any product tile navigates to `/products/:id` displaying detailed photos, rating breakdown, stock status, specs, and price. |
| **AC-5** | **Enquiry & Email**: GIVEN I am viewing a product AND I click Enquire button AND complete the form WHEN I submit THEN the sales inbox will receive an email AND customer sees a "Thank you" message | ✅ Covered | Form validates inputs, submits to backend, dispatches formatted email to Mailpit SMTP, and displays a "Thank You" confirmation card with reference ID (`ENQ-XXXX`). |

---

## Quick Start (Under 10 Minutes)

### Option 1: Docker Compose (Recommended — One Command)

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

```bash
# Clone and enter the repository
git clone https://github.com/arunsinghcodes/product-atlas.git
cd product-atlas

# Launch API, Web, and Mailpit in one command
docker compose up --build
```

Services will be accessible at:
- 🌐 **Product Atlas Web UI**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Product Atlas REST API**: [http://localhost:3001/api](http://localhost:3001/api)
- 📬 **Mailpit Visual Sales Inbox**: [http://localhost:8025](http://localhost:8025)

---

### Option 2: Local Development Setup (Node.js)

Prerequisites: Node.js v18+ and npm v9+.

```bash
# 1. Install all dependencies across monorepo workspaces
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start backend API in one terminal
npm --prefix apps/api run dev
# (Runs on http://localhost:3001/api)

# 4. Start frontend Vite dev server in a second terminal
npm --prefix apps/web run dev
# (Runs on http://localhost:5173)
```

---

## How to Test the Enquiry Email Flow (AC-5)

1. Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173` in local dev).
2. Click any product card (e.g., *"Fjallraven Backpack"* or *"Mens Cotton Jacket"*).
3. Click the blue **"Enquire About This Product"** button.
4. Complete the contact form (Name, Email, optional message) and click **"Submit Enquiry"**.
5. Observe the customer **"Thank you, [Name]!"** confirmation modal displaying the tracking reference code.
6. Open the Mailpit inbox at [http://localhost:8025](http://localhost:8025) to view the formatted inbound sales email with all enquiry details!

---

## Running Tests

All unit and integration tests run across the workspaces:

```bash
# Run all tests (NestJS Jest + React Vitest)
npm run test

# Run backend tests only
npm --prefix apps/api test

# Run frontend tests only
npm --prefix apps/web test
```

Test Results Summary:
- `apps/api`: **10 / 10 passed** (Featured products ranking, category grouping, search filter, enquiry email dispatch).
- `apps/web`: **2 / 2 passed** (Product card rendering, enquiry submission modal & thank-you confirmation).

---

## Architecture & Design Patterns

```
apps/
├── api/                    # NestJS Backend API
│   ├── src/
│   │   ├── products/       # Products domain & query logic
│   │   │   ├── adapters/   # IProductProvider, FakeStoreAdapter, MockProductAdapter
│   │   │   ├── data/       # Resilient seed fallback catalogue
│   │   │   └── dto/        # Validation DTOs
│   │   ├── categories/     # Categories domain (AC-2 top rated vs additional)
│   │   ├── enquiries/      # Enquiries domain & email dispatcher (AC-5)
│   │   │   └── adapters/   # IEmailProvider, SmtpEmailAdapter, ConsoleEmailAdapter
│   │   └── common/         # Global filters and logging interceptors
│   └── test/               # Jest test suites
│
└── web/                    # React 19 Client SPA
    ├── src/
    │   ├── components/     # Reusable UI (Header, Footer, ProductCard, EnquiryModal)
    │   ├── pages/          # Pages (HomePage, CategoryPage, SearchPage, ProductDetailsPage)
    │   ├── services/       # Typed backend API client (Never calls FakeStore)
    │   └── test/           # Vitest component test suites
```

### Decoupled Extensibility Highlights
- **Product Data Source**: The `IProductProvider` interface decouples the backend from Fake Store API. Swapping in a PostgreSQL database via Prisma or Shopify Storefront API only requires creating a new provider class and updating one line in `products.module.ts`.
- **Email Delivery Provider**: The `IEmailProvider` interface decouples email dispatch from Mailpit. Swapping in AWS SES or SendGrid requires only a new adapter implementation.

---

## Supporting Documentation

In compliance with the ANSR challenge evaluation criteria, detailed documentation is provided:
- 📑 [**DECISIONS.md**](./DECISIONS.md): Recorded assumptions, trade-offs, simplified requirements, and what we would build with another day.
- 🤖 [**AI_USAGE.md**](./AI_USAGE.md): Full breakdown of tools/models (Antigravity & Gemini), key shaping prompts, AI mistake analysis & human review, and time spent.
- 📋 [**AGENTS.md**](./AGENTS.md): Coding guidelines and architectural directives for AI agents.
- 📐 [**docs/PRD.md**](./docs/PRD.md): Product Requirements Document and Acceptance Criteria mapping.
- 🔀 [**PULL_REQUEST.md**](./PULL_REQUEST.md): Ready-to-use Pull Request description for submission into `main`.

---

## Author
**Arun Singh**  
GitHub: [@arunsinghcodes](https://github.com/arunsinghcodes)  
Repository: [product-atlas](https://github.com/arunsinghcodes/product-atlas)  
Candidate for **AI-Native Engineer** — ANSR

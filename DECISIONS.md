# Product Atlas — Architecture Decisions & Assumptions (DECISIONS.md)

This document records the architectural decisions, trade-offs, assumptions, and future evolution roadmap for **Product Atlas (Product Discovery Platform)**, fulfilling the requirements outlined in the ANSR AI-Native Engineer Challenge specification.

---

## 1. Assumptions Made Where Acceptance Criteria Were Unclear

| Area | Challenge Specification Gap | Architectural Assumption & Implementation |
|---|---|---|
| **Top-Rated Definition (AC-1)** | *"GIVEN I have chosen 5 products to be 'top rated'"* — Did not specify whether "chosen" implies manual curation or dynamic ranking. | Implemented dynamic ranking sorted by `rating.rate` descending, using `rating.count` as a secondary tie-breaker. This automatically surfaces the highest customer-rated items from any catalog provider while allowing an optional limit parameter (`?limit=5`). |
| **Category Page Partitioning (AC-2)** | *"THEN I see top rated products for that category AND I see additional products in that category"* — Did not define the threshold separating "top rated" from "additional". | Established a sensible threshold: items within the category with `rating.rate >= 4.0` are grouped into the **"Top Rated in [Category]"** section. To prevent empty sections in lower-rated categories, the service guarantees the top 2 items are placed in "Top Rated", while all remaining items populate **"Additional Products in [Category]"**. |
| **Search Semantics (AC-3)** | *"AND I have entered a search term in the search bar WHEN I click the search button THEN I only see products that have text matching that search term"* | Both a designated **Search Button** and keyboard `Enter` submission are supported. Search matching evaluates case-insensitive substrings against `title`, `description`, and `category` fields, returning high-relevance matches and a helpful empty-state screen if zero items match. |
| **Enquiry Delivery & Sales Inbox (AC-5)** | *"THEN the sales inbox will receive an email AND the customer will see a 'Thank you' message"* | To adhere strictly to Constraint #6 (*"must not depend on paid services or accounts the reviewer would need to create"*), we configured a local open-source **Mailpit** SMTP server via Docker. Reviewers can visit `http://localhost:8025` to inspect the visual HTML email with customer contact details, product title, and unique tracking code (`ENQ-XXXX`). |
| **Fake Store API Resilience** | Fake Store API (`https://fakestoreapi.com`) is notoriously slow (frequently experiencing 10–60 second latency spikes or downtime). | Implemented an in-memory TTL cache (5-minute TTL) and a 5-second fetch timeout with automatic graceful fallback to an embedded seed catalog (`MockProductAdapter`). If the external API stalls or the reviewer runs offline, the app responds in under 15ms. |

---

## 2. Requirements Dropped or Simplified (and Why)

1. **Complex Pagination**:
   - *Decision*: Kept all 20 products accessible via direct category navigation and full inventory view rather than multi-page numbered pagination.
   - *Rationale*: Fake Store API has only 20 products. Dividing 20 products across multiple paginated pages adds unnecessary navigation clicks for the reviewer.
2. **User Authentication & Customer Accounts**:
   - *Decision*: Did not implement customer login / JWT sessions.
   - *Rationale*: The MVP scenario focuses on an entrepreneur validating customer interest via browsing and enquiry. Requiring reviewers to register an account before testing product enquiry violates the 10-minute setup constraint.
3. **Shopping Cart & Checkout**:
   - *Decision*: Left checkout off the critical path, focusing on the requested "Enquire" workflow.
   - *Rationale*: The specification explicitly tests the B2B/B2C "Enquiry" model (inbound lead capture and sales email routing).

---

## 3. How the Design Supports Growing Beyond the PoC

The entrepreneur specified that *they have been burned by throwaway prototypes before* and want a foundation that can grow and evolve. Our architecture reflects this through strict **Hexagonal Architecture (Ports and Adapters)**:

```
┌────────────────────────────────────────────────────────┐
│                      React 19 Web                      │
└───────────────────────────┬────────────────────────────┘
                            │ REST (HTTP/JSON)
┌───────────────────────────▼────────────────────────────┐
│                  NestJS Core Backend                   │
│  Controllers  ──►  Services  ──►  Abstract Interfaces   │
└─────────────┬───────────────────────────┬──────────────┘
              │                               │
    [IProductProvider]                 [IEmailProvider]
              │                               │
    ┌─────────┴─────────┐           ┌─────────┴─────────┐
    ▼                   ▼           ▼                   ▼
FakeStoreAdapter  Postgres/Shopify SmtpAdapter      AWS SES / SendGrid
 (PoC Provider)    (Future Scale)   (Local Mailpit)   (Production)
```

1. **Data Source Decoupling**:
   - All product fetching implements `IProductProvider`.
   - The React client **never** communicates with Fake Store API.
   - Migrating to a production PostgreSQL database (Prisma / TypeORM), Shopify Storefront API, or Algolia requires writing a new adapter class that implements `IProductProvider` and swapping the dependency injection provider in `products.module.ts`. Zero changes to controllers or frontend code.
2. **Email Provider Decoupling**:
   - All email dispatches implement `IEmailProvider`.
   - For local development, `SmtpEmailAdapter` transmits to Mailpit with a fallback to `ConsoleEmailAdapter`.
   - In production on AWS, an `AwsSesEmailAdapter` can be plugged in with IAM role authentication.
3. **Multi-Client Readiness**:
   - The NestJS API provides strict DTO validation (`class-validator`), global CORS, and standard JSON REST responses.
   - Native iOS (Swift) or Android (Kotlin) apps can target the exact same API endpoints (`/api/products`, `/api/categories`, `/api/enquiries`) without modification.
4. **AWS Cloud Compatibility**:
   - Both backend and frontend are packaged into multi-stage, stateless Docker containers.
   - Backend is ready for **AWS ECS / Fargate** or **AWS App Runner**.
   - Frontend static assets can be deployed to **AWS S3 + CloudFront CDN**.

---

## 4. What We Would Build Next With Another Day

If granted an additional day of development, the roadmap includes:
1. **Persistent Relational Database**:
   - Introduce PostgreSQL with Prisma ORM to store products, categories, enquiry audit logs, and lead statuses (`NEW`, `CONTACTED`, `CLOSED`).
2. **Admin Portal**:
   - A password-protected dashboard for the sales team to view inbound enquiries, update lead stages, and manage product inventory.
3. **Faceted Search with Typo Tolerance**:
   - Integrate Meilisearch or Algolia for real-time instant search with typo tolerance, brand filters, and price sliders.
4. **Distributed Cache with Redis**:
   - Replace the in-memory Map cache with Redis (AWS ElastiCache) for horizontally scaled multi-instance deployments.
5. **E2E Playwright Test Suite**:
   - Automated end-to-end regression tests verifying the user journey from homepage -> search -> category view -> enquiry submission -> Mailpit verification.


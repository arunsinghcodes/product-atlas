# Product Requirements Document (PRD)
## ANSR AI-Native Engineer Challenge — Scalable Product Catalogue MVP

---

## 1. Executive Summary
The goal of this project is to build an interactive, production-ready Product Catalogue web application for an entrepreneur validating an e-commerce concept. While initial product metadata is sourced from the Fake Store API, the architecture is designed from day one to be decoupled, extensible, and ready for commercial scale (e.g., swapping product data sources to a dedicated database or Shopify, and routing sales enquiries to production CRM/email providers).

---

## 2. Personas & Use Cases
- **Shopper / Customer**:
  - Discovers top-rated featured products on the homepage.
  - Browses products organized by category, with top-rated items highlighted.
  - Searches for products by title or keyword.
  - Views comprehensive product details, pricing, and ratings.
  - Submits an enquiry for a product and receives a clear confirmation message.
- **Sales Team**:
  - Receives an automated, formatted email notification in the sales inbox whenever an enquiry is submitted, containing the customer's contact details and product reference.
- **Code Reviewer / Assessor**:
  - Clones the repository and launches the entire system (Frontend, Backend, and Local Mail Server) in under 10 minutes using a single command: `docker compose up`.
  - Reviews architectural decisions, test coverage, and AI engineering practices.

---

## 3. Acceptance Criteria Mapping

| ID | Feature | Given / When / Then Specification | Verification Method |
|---|---|---|---|
| **AC-1** | **Home Page Featured Products** | **GIVEN** I have chosen 5 products to be "top rated"<br>**WHEN** I am viewing the home page<br>**THEN** I see those 5 featured products | Homepage renders 5 products with highest ratings (`rating.rate` desc). |
| **AC-2** | **Category Page Organization** | **GIVEN** my products are organised into categories<br>**WHEN** I click on a category link<br>**THEN** I see top rated products for that category<br>**AND** I see additional products in that category | Category page features a "Top Rated" section followed by "Additional Products". |
| **AC-3** | **Product Search** | **GIVEN** I am looking for a specific product<br>**AND** I have entered a search term in the search bar<br>**WHEN** I click the search button<br>**THEN** I only see products that have text matching that search term | Search bar filters products by text query across title & description; returns filtered list. |
| **AC-4** | **Product Details Page** | **GIVEN** I am browsing the products<br>**AND** I want to see more details about a specific product<br>**WHEN** I click on a product tile<br>**THEN** I see the product details page | Clicking a tile navigates to `/products/:id` showing image, description, rating, price, and CTA. |
| **AC-5** | **Product Enquiry & Email** | **GIVEN** I am viewing a product<br>**AND** I am interested in a product<br>**AND** I click on the Enquire button<br>**AND** I complete the subsequent form with my contact details<br>**WHEN** I submit the form<br>**THEN** the sales inbox will receive an email<br>**AND** the customer will see a "Thank you" message | Submitting form posts to backend, sends email to Mailpit SMTP, and shows modal "Thank you" confirmation. |

---

## 4. Technical Constraints
1. **Client**: React Web Application with TypeScript.
2. **Backend**: Node.js with NestJS and TypeScript.
3. **Data Boundary**: Client never queries Fake Store API directly. All requests go through backend.
4. **Extensibility**: Product provider and Email provider use interface-based adapter patterns.
5. **Infrastructure**: AWS-compatible containerized deployment (`docker-compose.yml`).
6. **Zero Paid Accounts**: Local Mailpit server for visual inspection of sent emails on port 8025.

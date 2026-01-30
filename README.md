# TraceLog API

## Description

**TraceLog API** is the backend service of the Trace-Log system.
Its purpose is to receive, process, and store information about changes made in source code repositories, providing a structured and queryable history of a project's technical evolution.

This service acts as the central data and logic layer of the system, exposing the necessary information for auditing, analysis, and consumption by external tools or user interfaces.

## Purpose

The main goal of TraceLog API is to:

* Register every change made in a source code repository.
* Associate commits with specific functional modules.
* Make historical change analysis easier without relying directly on raw Git history.
* Provide technical context for code reviews, audits, and decision-making.

This backend does not replace Git; it **organizes and contextualizes Git data**.

## What this backend does

* Receives change events from external systems (for example, CI/CD integrations).
* Analyzes structured commit messages.
* Stores relevant metadata about commits, authors, files, and modules.
* Exposes endpoints to query the historical traceability of a project.
* Serves as a data source for dashboards, reports, and analysis tools.

## What this repository does NOT include

* User interfaces.
* Dashboards or visualizations.
* Git repository configuration.
* CI/CD automation setups.

This repository contains **only the backend logic and data persistence layer**.

## Use cases

* Technical auditing of changes.
* Module-level impact analysis.
* Identification of areas with high change frequency.
* Support for analysis tools or AI systems that require historical code context.

## Project status

This project is under active development.
The backend structure and responsibilities are designed to scale and adapt to different environments and workflows.

Perfect. Here is the updated **Roadmap** and **Current Implementation** sections, refined in English to match the professional tone of your GitHub README.

## Implementation Roadmap

### Phase 1: Infrastructure & Persistence `[DONE]`

* [x] **Database Setup:** Instance configuration in **TursoDB** and connection via **libSQL**.
* [x] **Data Modeling:** Relational schema definition in **Drizzle ORM** (Projects, Authors, Commits, and Files).
* [x] **Migrations:** Execution of initial structural migrations and schema versioning.

### Phase 2: Ingestion Engine & Machine-to-Machine (M2M) Security `[DONE]`

*This phase secures the data entry point from external CI/CD pipelines.*

* [x] **Ingestion API:** HonoJS endpoints optimized for Cloudflare Workers to receive Git metadata.
* [x] **Conventional Commits Parser:** Logic to extract `type`, `module`, and `message` from raw commit strings.
* [x] **M2M Auth (API Keys):** Generation and management of long-lived keys for GitHub Actions.
* [x] **Secure Key Storage:** Implementation of SHA-256 hashing + Salts for API key persistence in TursoDB.
* [x] **Organization Validation:** Middleware to verify that incoming data belongs to a registered Organization using API Key–based identity (v1).

> ⚠️ **Note:** API Key–based authentication was implemented as an initial, pragmatic solution to validate ingestion flows.
> It is now considered **legacy** and is being progressively replaced by an OIDC-based identity model.

### Phase 2.1: OIDC-Based Workload Identity (CI/CD) `[PLANNED / IN PROGRESS]`

*This phase upgrades machine-to-machine authentication by replacing static secrets with short-lived, verifiable identities.*

* [ ] **GitHub Actions OIDC Integration:** Enable OpenID Connect token issuance for ingestion workflows.
* [ ] **JWT Verification Middleware:** Stateless cryptographic validation of GitHub-issued OIDC tokens using public JWKS.
* [ ] **Claim-Based Authorization:** Fine-grained validation based on repository owner, repository name, branch, and workflow identity.
* [ ] **Stateless Organization Mapping:** Organization resolution derived from verified token claims (repository owner / org) without persistent secrets.

* [ ] **API Key Deprecation Strategy:** Gradual phase-out of static API keys while maintaining backward compatibility.


### Phase 3: Identity & User Session Management (Web Auth) `[IN PROGRESS]`

> *This phase is strictly scoped to **human users** and explicitly excludes machine-to-machine authentication, which is handled via OIDC in the ingestion layer.*

* [x] **Better-Auth Integration:** OAuth (GitHub) configuration for user login.
* [x] **User-Session vs. Machine Identity Separation:** Decoupling session-based authentication (Cookies/JWT) for the UI from machine-based authentication (API Keys / OIDC) for the ingestion layer.
* [x] **Secure Session Persistence:** Cross-device session management stored in TursoDB.
* [x] **Development Playground:** Isolated test environment for session flow validation (Disabled in Production).
* [ ] **RBAC & Multi-tenancy:** Implementing Role-Based Access Control to ensure users can only rotate keys and view metrics for their own Organizations.

### Phase 4: Query API & Frontend Contracts `[TODO]`

*Preparing the data for secure consumption by the Angular Dashboard.*

* [ ] **Protected Query Endpoints:** Implementing the `authMiddleware` across all `GET` routes to validate user sessions before returning data.
* [ ] **Aggregation Endpoints:** Creating `GET /api/metrics` routes for pre-processed analytical data (e.g., "Commits per day").
* [ ] **API Documentation:** OpenAPI/Scalar setup to define data contracts for frontend developers.
* [ ] **CORS & Security Headers:** Explicitly allowing the Angular domain to interact with the API while blocking unauthorized origins.

### Phase 5: Visualization & Analysis Interface `[TODO]`

* [ ] **Angular Dashboard:** Implementation of the "Organization Settings" view for API key management and rotation.
* [ ] **Signal/RxJS Integration:** Optimized query services with module-level filtering and time-range selection.
* [ ] **Data Visualization:** Integration of metrics libraries (e.g., ngx-charts) for change frequency analysis.

### Phase 6: Automation & AI Connectivity `[TODO]`

* [ ] **MCP Server Implementation:** Exposing context so AI agents (Claude, ChatGPT) can "read" the technical history and reason about the codebase.
* [ ] **Observability:** Internal logging system to monitor ingestion engine performance and error rates.


## Note on Security Layers

### Environment Setup Note

To maintain security and a clean production build, the **Auth Playground** (`/api/accounts/test`) is conditionally loaded. It will only be registered in the Hono router if `NODE_ENV` is set to `development`. In production environments, this route will return a `404 Not Found`.

### Key Distinction Added

> **Note on Security Layers:** TraceLog uses a layered authentication strategy.  
> The Ingestion Engine supports machine-based authentication (initially via hashed API Keys, evolving toward OIDC workload identity), while the Dashboard API uses session-based authentication via Better-Auth to ensure that only authenticated human users can access sensitive metrics and management tools.



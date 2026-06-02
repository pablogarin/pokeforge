# PokeForge: Gen-3 Tactical IV Engine & AI Guide

PokeForge is a specialized, high-density development project designed to build enterprise-grade engineering skills. It delivers an Individual Value (IV) calculation engine and automated AI tactical advisor for *Pokémon FireRed* and *LeafGreen* (Generation 3). 

The platform features a containerized architecture orchestrated via local Kubernetes, secure token authentication, high-performance React data flows, and contextual LLM integration.

---

## 🏛️ System Architecture

```text
  [ React Client Mobile/Web ]
              │
    (REST / JSON / Auth)
              ▼
    [ Node.js API Backend ] ◄─── (Cache Base Stats) ───► [ PokeAPI ]
              │
              ├─── (Save Pokémon Records) ─────────────► [ PostgreSQL ]
              │
              └─── (Team Strategy / Move Advice) ──────► [ OpenAI API ]
```

### Microservices Breakdown
*   **Frontend**: React 19 single-page application optimized with Vite, Tailwind CSS, and strict TypeScript. Served production-ready via Nginx.
*   **Backend**: Node.js REST API processing cryptographic computations, algorithmic IV tracking, external API integrations, and session authentication.
*   **Database**: PostgreSQL relational database holding user accounts, credentials, and saved Pokémon party tables.

---

## 🧬 Engineering Requirements

### 1. Mathematical IV Reverse-Engine
In Generation 3, stats are calculated using discrete floor functions. PokeForge reverses these formulas using a high-performance looping algorithm to solve for the missing variable (\(IV \in [0, 31]\)) based on the user's input.

*   **Stat Calculation Formula (Non-HP):**
    \[\text{Stat} = \left\lfloor \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\text{EV}}{4} \rfloor) \times \text{Level}}{100} + 5 \right\rfloor \times \text{NatureModifier} \right\rfloor\]
*   **HP Calculation Formula:**
    \[\text{HP} = \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\text{EV}}{4} \rfloor) \times \text{Level}}{100} \right\rfloor + \text{Level} + 10\]

### 2. External API Pipelines
*   **PokeAPI Integration**: Fetches raw Gen-3 base stats synchronously from `https://pokeapi.co{id_or_name}`. Responses are aggressively cached in the PostgreSQL persistence layer to prevent network overhead and rate-limiting.
*   **OpenAI GPT-4o-mini Integration**: Connects to the OpenAI completions endpoint. Uses a locked system prompt constraining responses strictly to Gen-3 mechanics, current game badge state, and existing active party layout.

### 3. Security & Session Topology
*   **Password Cryptography**: Passwords salted and hashed with `bcrypt` on registration.
*   **Authentication Engine**: Stateless JSON Web Tokens (JWT).
*   **Token Transmission Security**: Delivered to the client browser strictly inside `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to establish absolute protection against XSS and CSRF token interception vectors.

---

## 🛠️ DevOps & Infrastructure Setup

The infrastructure relies entirely on localized virtualization using **Docker** containers and a localized orchestration layer managed via **Kubernetes** (using Minikube or Kind).

```text
[ Local Kubernetes Cluster ]
 ├── Ingress Controller (Intercepts & forwards http://pokeforge.local traffic)
 ├── Frontend Deployment (Runs dual, highly available Nginx pods serving React)
 ├── Backend Deployment (Runs scalable server pods injecting OpenAI credentials)
 └── PostgreSQL StatefulSet (Maintains persistent physical volumes on host disc)
```

---

## 📅 The 20-Hour Implementation Sprint

[Phase 1: Foundation]   [Phase 2: Mechanics]    [Phase 3: Async Infrastructure]     [Phase 4: Systems]
Hours 1-5               Hours 6-10              Hours 11-15                         Hours 16-20

### Module 1: Core Architecture, Auth & Containers (Hours 1–5)
*   Containerize Node.js, PostgreSQL, and Nginx with separate `Dockerfiles`.
*   Establish relational database schemas for Users and Saved Pokémon.
*   Implement JWT generation, password-hashing, and secure browser cookie authorization flows.

### Module 2: The Core Mathematics & PokeAPI Caching (Hours 6–10)
*   Write the backend IV reverse-engineering loop matching Gen-3 math parameters.
*   Build the PokeAPI client middleware with local database persistence to prevent duplicate API hits.
*   Construct the optimized React State `useReducer` to manage multi-variable calculator adjustments flawlessly.

### Module 3: Modern UI Data Views & Compound Design Patterns (Hours 11–15)
*   Design a responsive single-page evaluation UI dashboard using HTML tables.
*   Apply the **Compound Component Pattern** to modularize the interactive character selector fields and modal creation grids.
*   Isolate asynchronous computation tracking into custom React hooks (`useIVCalculator`).

### Module 4: OpenAI Strategy Engine & Kubernetes Orchestration (Hours 16–20)
*   Create the backend OpenAI prompt middleware restricting game state output strictly to *FireRed/LeafGreen* boundaries.
*   Write client interfaces summarizing move suggestions, team synergy improvements, and badge progression targets.
*   Compose Kubernetes deployment configurations (`deployment.yaml`, `statefulset.yaml`, `ingress.yaml`) and verify cluster initializations execute successfully.

---

## 🏁 Verification & Production Launch Checklist
1. **Compiles cleanly**: Zero TypeScript compiler warnings or `any` structural type escapes on client and backend layers.
2. **Network Caching Active**: Requesting a previously queried monster handles base stat mappings in `< 5ms` from local data tables.
3. **Cluster Resilience**: Tearing down a running backend API Kubernetes Pod causes the Ingress Controller to route active user tracking onto secondary pods with zero client session disruption.
4. **Prompt Enforcement**: AI dashboard correctly refuses to suggest items, abilities, or moves introduced in Generation 4 or later games.

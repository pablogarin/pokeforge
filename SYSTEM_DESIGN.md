# Master System Design Specification: PokeForge

This document establishes the architecture, service boundaries, and data processing pathways for PokeForge. It serves as the authoritative source of truth for both development squads and automated AI coding agents.

## 1. Directory Topology
The workspace uses a multi-repository workspace pattern to segregate functional concerns, deployment processes, and infrastructure requirements.

*   `pokeforge-db/`: Manages database lifecycle scripts, constraints, migrations, and local seed records.
*   `pokeforge-front/`: Hosts the pure client interface layer (React SPA compiled via Vite).
*   `pokeforge-services/`: Groups independent, decoupled Python processing microservices.
*   `pokeforge-infra/`: Manages orchestrations, cluster definitions, local containerization networks, and Ingress routing rules.

---

## 2. Core Technical Architecture Stack
*   **Database**: PostgreSQL v15 (utilizing native arrays, case-insensitive text extensions, and trigger validations).
*   **Client Core**: React v19 SPA (using Vite for compilation optimization, Tailwind CSS for interface layout, and Apollo Client / Urql for data fetching).
*   **Service Engine**: Python v3.11+ powered by FastAPI (asynchronous processing, strict Pydantic type safety models, and Strawberry for the GraphQL engine layer).

---

## 3. Distributed Service Architecture & Data Flow

```text
[ React Client SPA (Nginx) ] ── (GraphQL / HTTP) ──► [ Ingress Route Controller ]
                                                             │
                    ┌────────────────────────────────────────┴────────────────────────────────────────┐
                    ▼                                        ▼                                        ▼
      [ service-auth-oauth ]                  [ service-iv-calc ]                     [ service-ai-advisor ]
     (Google Authentication Engine)         (Algorithmic Range Finder)               (OpenAI Prompt Streamer)
                    │                                        │                                        │
                    └────────────────────────────────────────┼────────────────────────────────────────┘
                                                             ▼
                                                    [ PostgreSQL Pod ]
```

### 3.1 GraphQL Operational Schema (Read Operations)
The `service-iv-calc` microservice exposes a GraphQL endpoint to minimize payload delivery overhead for the React client.

```graphql
enum PokemonGender { Male Female Genderless }
enum PokemonNature { Hardy Lonely Brave Adamant Naughty Bold Docile Relaxed Impish Lax Timid Hasty Serious Jolly Naive Modest Mild Quiet Bashful Rash Calm Gentle Sassy Careful Quirky }
enum PokemonElementType { Normal Fire Water Grass Electric Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Steel Dark }

type GlobalMove {
  id: Int!
  name: String!
  type: PokemonElementType!
  power: Int
  pp: Int
}

type GlobalPokemon {
  id: Int!
  name: String!
  types: [PokemonElementType!]!
  baseHp: Int!
  baseAttack: Int!
  baseDefense: Int!
  baseSpAttack: Int!
  baseSpDefense: Int!
  baseSpeed: Int!
}

type UserPokemon {
  id: Int!
  customNickname: String
  level: Int!
  gender: PokemonGender!
  nature: PokemonNature!
  isInRooster: Boolean!
  currentHp: Int!
  currentAttack: Int!
  currentDefense: Int!
  currentSpAttack: Int!
  currentSpDefense: Int!
  currentSpeed: Int!
  ivRangeHp: [Int!]!
  ivRangeAttack: [Int!]!
  ivRangeDefense: [Int!]!
  ivRangeSpAttack: [Int!]!
  ivRangeSpDefense: [Int!]!
  ivRangeSpeed: [Int!]!
  knownMoves: [GlobalMove!]!
  pokemonReference: GlobalPokemon!
}

type Query {
  getMyCollection(includeStorage: Boolean): [UserPokemon!]!
  getGlobalPokedex: [GlobalPokemon!]!
}
```

### 3.2 REST API Endpoint Specifications (Write & Sync Operations)

#### POST /api/v1/iv/calculate
Processes raw physical data and reverse-engineers Generation 3 game formulas to calculate precise client IV boundaries.
*   **Service Location**: `pokeforge-services/service-iv-calc`
*   **Payload Shape**:
```json
{
  "pokemonId": 6,
  "level": 50,
  "nature": "Adamant",
  "stats": {"hp": 153, "attack": 149, "defense": 98, "spAttack": 102, "spDefense": 105, "speed": 120},
  "evs": {"hp": 0, "attack": 252, "defense": 0, "spAttack": 0, "spDefense": 0, "speed": 252}
}
```
*   **Response Shape**:
```json
{
  "status": "success",
  "ivRanges": {
    "hp": [22, 25], "attack": [28, 31], "defense": [14, 18],
    "spAttack": [5, 9], "spDefense": [20, 24], "speed": [29, 31]
  }
}
```

#### POST /api/v1/strategy/advise
Aggregates a user's active roster attributes into a secure, context-locked prompt payload for OpenAI.
*   **Service Location**: `pokeforge-services/service-ai-advisor`
*   **Payload Shape**:
```json
{
  "currentGameStage": "Just defeated Lt. Surge, heading to Rock Tunnel",
  "userNote": "I need a Ground-type move to handle electric counters. Any ideas?"
}
```
*   **Response Shape**: Text string chunks streamed to the client interface using Server-Sent Events (SSE).

---

## 4. Engineering & Computational Domain Invariants

### 4.1 Automated IV Reverse-Engineering Logic
Because nested mathematical floor calls reduce numerical precision in Generation 3 save data, the system brute-forces variable possibilities across all possible options (\(0 \le IV \le 31\)).

*   **HP Equation Model**:
    $$\text{HP} = \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\text{EV}}{4} \rfloor) \times \text{Level}}{100} \right\rfloor + \text{Level} + 10$$
*   **Standard Stat Equation Model**:
    $$\text{Stat} = \left\lfloor \left\lfloor \frac{(2 \times \text{Base} + \text{IV} + \lfloor \frac{\frac{\text{EV}}{4}}{100} \rfloor) \times \text{Level}}{100} + 5 \right\rfloor \times \text{NatureModifier} \right\rfloor$$

### 4.2 OpenAI Isolation Boundaries
The `service-ai-advisor` service applies strict system instructions to keep suggestions locked down to original Game Boy Advance parameters:
*   **System Configuration Prompt**:
    `You are a strict tactical simulation processor dedicated to the Game Boy Advance titles Pokémon FireRed and LeafGreen (Generation 3). You analyze party arrays comprising string names, levels, known moves, and exact calculated IV minimum/maximum boundaries. Provide brief, data-focused optimizations. Never recommend moves, evolutionary lines, items, natures mints, abilities, or elements (such as Fairy-type) introduced in Generation 4 or later.`

---

## 5. Security & Session Topology
1.  **Authentication Handshake**: React client routes sign-in requests through `service-auth-oauth`, redirecting the user to Google OAuth 2.0 endpoints.
2.  **Identity Resolution**: The Python API receives the validation authorization codes, requests verified email records from Google backend systems, and looks up or provisions accounts in PostgreSQL.
3.  **Session Preservation**: The backend issues a stateless JWT stored securely in the user's browser using an `HttpOnly`, `Secure`, `SameSite=Strict` cookie header configuration. This configuration blocks XSS script access and CSRF interception loops.


# PokeForge Services Layer Specification

This directory houses the independent, asynchronous Python microservices powering the PokeForge platform. Each service runs an isolated FastAPI instance optimized for specialized high-density computation, external API orchestration, or text streaming.

## 📁 Sub-Repository Directory Structure

```text
pokeforge-services/
├── README.md               # Master backend specification file
├── service-auth-oauth/     # Google OAuth 2.0 handshake & session token service
├── service-iv-calc/        # Algorithmic IV calculation & GraphQL data service
└── service-ai-advisor/     # Context-locked OpenAI strategy & advice streamer
```

## 🛠️ Microservice Core Tech Stack
*   **Engine Core**: Python 3.11+
*   **Web Framework**: FastAPI (Asynchronous ASGI execution loops)
*   **Validation Layer**: Pydantic v2 (Strict runtime type verification)
*   **Data Resolution**: Strawberry GraphQL (Type-safe query engine)
*   **Database Client**: `psycopg` (Native connection pool manager)

## 🧬 Architectural Constraints for Services
1. **Asynchronous I/O**: All database handles, authentication fetches, and OpenAI streams must utilize async/await drivers (`asyncio`, `httpx`, async connection pools) to prevent thread block bottlenecks.
2. **Idempotent Lifespans**: Services must autonomously handle their data lifecycle prerequisites upon boot (e.g., verifying schemas, validating reference tables) before opening public interface ports.
3. **Stateless Session Transport**: Services must read JWT user details strictly from secure browser request cookies. Services do not maintain internal data session states.


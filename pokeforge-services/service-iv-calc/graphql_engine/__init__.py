import strawberry
from typing import List
from .types import GlobalPokemon
from .resolvers import resolve_global_pokedex


@strawberry.type
class Query:
    getGlobalPokedex: List[GlobalPokemon] = strawberry.field(
        resolver=resolve_global_pokedex
    )


schema = strawberry.Schema(query=Query)

__all__ = ["schema"]

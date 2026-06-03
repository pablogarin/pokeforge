import strawberry
from typing import List
from .types import GlobalPokemon, UserPokemon
from .resolvers import resolve_global_pokedex, resolve_my_collection
from .mutations import Mutation
from .graphql_context import GraphQLContext


@strawberry.type
class Query:
    getGlobalPokedex: List[GlobalPokemon] = strawberry.field(
        resolver=resolve_global_pokedex
    )
    getMyCollection: List[UserPokemon] = strawberry.field(
        resolver=resolve_my_collection
    )


schema = strawberry.Schema(query=Query, mutation=Mutation)

__all__ = ["schema", "GraphQLContext"]

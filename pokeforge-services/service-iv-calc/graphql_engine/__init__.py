import strawberry
from strawberry.schema.config import StrawberryConfig
from typing import List
from .types import GlobalPokemon, UserPokemon, User
from .resolvers import (
    resolve_global_pokedex,
    resolve_my_collection,
    resolve_search_pokemon,
    resolve_user,
)
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
    getUserInfo: User = strawberry.field(resolver=resolve_user)
    getPokemonByName: List[GlobalPokemon] = strawberry.field(
        resolver=resolve_search_pokemon
    )


config = StrawberryConfig(auto_camel_case=True)
schema = strawberry.Schema(query=Query, mutation=Mutation, config=config)

__all__ = ["schema", "GraphQLContext"]

import strawberry
from strawberry.schema.config import StrawberryConfig
from typing import List
from .types import GlobalPokemon, Move, UserPokemon, User
from .resolvers import (
    resolve_global_pokedex,
    resolve_my_collection,
    resolve_search_pokemon,
    resolve_user,
    resolve_global_moves,
    resolve_pokemon_from_collection,
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
    getUserPokemon: UserPokemon = strawberry.field(
        resolver=resolve_pokemon_from_collection
    )
    getPokemonByName: List[GlobalPokemon] = strawberry.field(
        resolver=resolve_search_pokemon
    )
    getGlobalMoves: list[Move] = strawberry.field(resolver=resolve_global_moves)


config = StrawberryConfig(auto_camel_case=True)
schema = strawberry.Schema(query=Query, mutation=Mutation, config=config)

__all__ = ["schema", "GraphQLContext"]

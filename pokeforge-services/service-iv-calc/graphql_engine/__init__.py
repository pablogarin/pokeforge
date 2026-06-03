import strawberry
from typing import List
from .types import GlobalPokemon, UserPokemon, User
from .resolvers import resolve_global_pokedex, resolve_my_collection, resolve_user
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


schema = strawberry.Schema(query=Query, mutation=Mutation)

__all__ = ["schema", "GraphQLContext"]

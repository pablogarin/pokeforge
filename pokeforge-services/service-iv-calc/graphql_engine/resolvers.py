from strawberry.types import Info
from typing import List
from .types import GlobalPokemon, UserPokemon, User
from database import PokemonRepository


def resolve_global_pokedex() -> List[GlobalPokemon]:
    rows = PokemonRepository.fetch_all_global_pokemons()

    return [
        GlobalPokemon(
            id=row["id"],
            name=row["name"].capitalize(),
            types=row["types"],
            base_hp=row["base_hp"],
            base_attack=row["base_attack"],
            base_defense=row["base_defense"],
            base_sp_attack=row["base_sp_attack"],
            base_sp_defense=row["base_sp_defense"],
            base_speed=row["base_speed"],
        )
        for row in rows
    ]


def resolve_my_collection(
    info: Info, include_storage: bool = True
) -> List[UserPokemon]:
    user_id = info.context.user_id

    if not user_id:
        raise Exception("Access denied")

    rows = PokemonRepository.fetch_user_collection(
        user_id=user_id, include_storage=include_storage
    )
    return [
        UserPokemon(
            id=row["id"],
            user_id=row["user_id"],
            pokemon_id=row["pokemon_id"],
            custom_nickname=row["custom_nickname"] if row["custom_nickname"] else None,
            level=row["level"],
            gender=row["gender"],
            nature=row["nature"],
            is_in_rooster=row["is_in_rooster"],
            current_hp=row["current_hp"],
            current_attack=row["current_attack"],
            current_defense=row["current_defense"],
            current_sp_attack=row["current_sp_attack"],
            current_sp_defense=row["current_sp_defense"],
            current_speed=row["current_speed"],
            iv_range_hp=row["iv_range_hp"],
            iv_range_attack=row["iv_range_attack"],
            iv_range_defense=row["iv_range_defense"],
            iv_range_sp_attack=row["iv_range_sp_attack"],
            iv_range_sp_defense=row["iv_range_sp_defense"],
            iv_range_speed=row["iv_range_speed"],
            known_move_ids=row["known_move_ids"],
        )
        for row in rows
    ]


def resolve_user(info: Info) -> User:
    user_id = info.context.user_id

    if not user_id:
        raise Exception("Not authorized")

    user = PokemonRepository.fetch_user(user_id)
    if not user:
        raise Exception("User not found")

    return User(
        id=user["id"],
        email=user["email"],
        google_id=user["google_id"],
        display_name=user["display_name"],
        avatar_url=user["avatar_url"],
    )


def resolve_search_pokemon(query: str) -> List[GlobalPokemon]:
    if not query:
        return []

    rows = PokemonRepository.fetch_pokemon_by_partial_name(query)

    return [
        GlobalPokemon(
            id=row["id"],
            name=row["name"].capitalize(),
            types=row["types"],
            base_hp=row["base_hp"],
            base_attack=row["base_attack"],
            base_defense=row["base_defense"],
            base_sp_attack=row["base_sp_attack"],
            base_sp_defense=row["base_sp_defense"],
            base_speed=row["base_speed"],
        )
        for row in rows
    ]

from strawberry.types import Info
from typing import Dict, List, Optional
from .types import GlobalPokemon, Move, UserPokemon, User
from database import PokemonRepository


def resolve_global_pokedex() -> List[GlobalPokemon]:
    rows = PokemonRepository.fetch_all_global_pokemons()

    return [
        GlobalPokemon(
            id=row["id"],
            name=row["name"].capitalize(),
            height=row["height"],
            weight=row["weight"],
            species_id=row["species_id"],
            genus=row["genus"],
            flavor_text=row["flavor_text"],
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


def getUserPokemonFromDict(data: Dict) -> UserPokemon:
    return UserPokemon(
        id=data["id"],
        user_id=data["user_id"],
        pokemon_id=data["pokemon_id"],
        custom_nickname=data["custom_nickname"] if data["custom_nickname"] else None,
        level=data["level"],
        gender=data["gender"],
        nature=data["nature"],
        is_in_rooster=data["is_in_rooster"],
        current_hp=data["current_hp"],
        current_attack=data["current_attack"],
        current_defense=data["current_defense"],
        current_sp_attack=data["current_sp_attack"],
        current_sp_defense=data["current_sp_defense"],
        current_speed=data["current_speed"],
        iv_range_hp=data["iv_range_hp"],
        iv_range_attack=data["iv_range_attack"],
        iv_range_defense=data["iv_range_defense"],
        iv_range_sp_attack=data["iv_range_sp_attack"],
        iv_range_sp_defense=data["iv_range_sp_defense"],
        iv_range_speed=data["iv_range_speed"],
        known_move_ids=data["known_move_ids"],
    )


def resolve_pokemon_from_collection(
    info: Info, pokemon_id: int
) -> Optional[UserPokemon]:
    user_id = info.context.user_id

    if not user_id:
        raise Exception("Not Authorized")

    pokemon = PokemonRepository.fetch_user_pokemon(
        pokemon_id=pokemon_id, user_id=user_id
    )
    if pokemon:
        return getUserPokemonFromDict(data=pokemon)


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
            height=row["height"],
            weight=row["weight"],
            species_id=row["species_id"],
            genus=row["genus"],
            flavor_text=row["flavor_text"],
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


def resolve_global_moves():
    rows = PokemonRepository.fetch_all_moves()
    return [
        Move(
            id=row["id"],
            name=row["name"],
            type=row["type"],
            power=row["power"],
            pp=row["pp"],
        )
        for row in rows
    ]

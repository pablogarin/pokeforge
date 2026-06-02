from typing import List
from .types import GlobalPokemon
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

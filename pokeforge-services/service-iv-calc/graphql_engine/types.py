import strawberry
from typing import List, Optional
from database import PokemonRepository


@strawberry.type
class GlobalMove:
    id: int
    name: str
    type: str
    power: Optional[int]
    pp: Optional[int]


@strawberry.type
class GlobalPokemon:
    id: int
    name: str
    height: int
    weight: int
    species_id: int
    genus: str
    flavor_text: str
    types: List[str]
    base_hp: int
    base_attack: int
    base_defense: int
    base_sp_attack: int
    base_sp_defense: int
    base_speed: int


@strawberry.type
class User:
    id: int
    email: str
    google_id: str
    display_name: str
    avatar_url: str


@strawberry.type
class UserPokemon:
    id: int
    user_id: int
    pokemon_id: int
    custom_nickname: Optional[str]
    level: int
    gender: str
    nature: str
    is_in_rooster: bool
    current_hp: int
    current_attack: int
    current_defense: int
    current_sp_attack: int
    current_sp_defense: int
    current_speed: int
    iv_range_hp: List[int]
    iv_range_attack: List[int]
    iv_range_defense: List[int]
    iv_range_sp_attack: List[int]
    iv_range_sp_defense: List[int]
    iv_range_speed: List[int]

    known_move_ids: List[int]

    @strawberry.field
    def known_moves(self) -> List[GlobalMove]:
        if not self.known_move_ids:
            return []

        rows = PokemonRepository.fetch_moves_by_ids(self.known_move_ids)
        return [
            GlobalMove(
                id=row["id"],
                name=row["name"],
                type=row["type"],
                power=row["power"],
                pp=row["pp"],
            )
            for row in rows
        ]

    @strawberry.field
    def pokemon_reference(self) -> Optional[GlobalPokemon]:
        row = PokemonRepository.fetch_pokemon_by_id(self.pokemon_id)
        if not row:
            return None
        return GlobalPokemon(
            id=row["id"],
            name=row.get("name", "").capitalize(),
            types=row["types"],
            base_hp=row["base_hp"],
            base_attack=row["base_attack"],
            base_defense=row["base_defense"],
            base_sp_attack=row["base_sp_attack"],
            base_sp_defense=row["base_sp_defense"],
            base_speed=row["base_speed"],
        )

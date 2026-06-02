import strawberry
from typing import List, Optional


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
    types: List[str]
    base_hp: int
    base_attack: int
    base_defense: int
    base_sp_attack: int
    base_sp_defense: int
    base_speed: int


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

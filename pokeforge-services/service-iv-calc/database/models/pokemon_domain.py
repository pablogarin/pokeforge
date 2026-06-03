from pydantic import BaseModel, Field
from typing import List, Optional


class PokemonDomainModel(BaseModel):
    id: int
    name: str
    types: List[str]
    base_hp: int
    base_attack: int
    base_defense: int
    base_sp_attack: int
    base_sp_defense: int
    base_speed: int

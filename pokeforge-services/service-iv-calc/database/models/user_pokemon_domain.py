from pydantic import BaseModel, Field
from typing import List, Optional


class UserPokemonDomainModel(BaseModel):
    id: Optional[int] = None
    user_id: int
    pokemon_id: int
    custom_nickname: Optional[str] = None
    level: int = Field(..., ge=1, le=100)
    gender: str
    nature: str
    is_in_rooster: bool = False

    current_hp: int
    current_attack: int
    current_defense: int
    current_sp_attack: int
    current_sp_defense: int
    current_speed: int

    iv_range_hp: List[int] = Field(..., max_length=2)
    iv_range_attack: List[int] = Field(..., max_length=2)
    iv_range_defense: List[int] = Field(..., max_length=2)
    iv_range_sp_attack: List[int] = Field(..., max_length=2)
    iv_range_sp_defense: List[int] = Field(..., max_length=2)
    iv_range_speed: List[int] = Field(..., max_length=2)

    known_move_ids: List[int] = Field(..., max_length=4)

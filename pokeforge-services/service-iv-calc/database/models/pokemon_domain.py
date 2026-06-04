from pydantic import BaseModel, Field
from typing import List, Optional


class PokemonDomainModel(BaseModel):
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
    evolution_chain_id: int
    evolves_from_species_id: Optional[int]

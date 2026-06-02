from pydantic import BaseModel, Field
from .stat_set import StatSet
from .ev_set import EVSet


class IVCalculationRequest(BaseModel):
    pokemon_id: int = Field(
        ..., gt=0, le=386, description="National pokedex identifier up to Gen 3"
    )
    level: int = Field(..., ge=1, le=100, description="Current pokemon level")
    nature: str = Field(..., description="Pokemon nature")
    stats: StatSet
    evs: EVSet

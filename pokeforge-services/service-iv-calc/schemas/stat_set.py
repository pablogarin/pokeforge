from pydantic import BaseModel, Field


class StatSet(BaseModel):
    hp: int = Field(..., gt=0, description="Current raw HP stat value")
    attack: int = Field(..., gt=0, description="Current raw Attack stat value")
    defense: int = Field(..., gt=0, description="Current raw Defense stat value")
    sp_attack: int = Field(
        ..., gt=0, description="Current raw Special Attack stat value"
    )
    sp_defense: int = Field(
        ..., gt=0, description="Current raw Special Defense stat value"
    )
    speed: int = Field(..., gt=0, description="Current raw Speed stat value")

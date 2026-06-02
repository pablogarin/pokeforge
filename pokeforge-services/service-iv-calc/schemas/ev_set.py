from pydantic import BaseModel, Field, model_validator
from typing import Self


class EVSet(BaseModel):
    hp: int = Field(0, ge=0, le=252)
    attack: int = Field(0, ge=0, le=252)
    defense: int = Field(0, ge=0, le=252)
    sp_attack: int = Field(0, ge=0, le=252)
    sp_defense: int = Field(0, ge=0, le=252)
    speed: int = Field(0, ge=0, le=252)

    @model_validator(mode="after")
    def validate_total_evs(self) -> Self:
        total = (
            self.hp
            + self.attack
            + self.defense
            + self.sp_attack
            + self.sp_defense
            + self.speed
        )
        if total > 510:
            raise ValueError(
                f"Total effort values allocation ({total}) cannot exceed the game limit of 510"
            )
        return self

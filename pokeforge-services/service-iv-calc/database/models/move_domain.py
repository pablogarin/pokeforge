from pydantic import BaseModel


class MoveDomainModel(BaseModel):
    id: int
    name: str
    type: str
    power: int
    pp: int

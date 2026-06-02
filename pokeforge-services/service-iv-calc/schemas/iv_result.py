from pydantic import BaseModel
from typing import Dict


class IVRangeResult(BaseModel):
    min_iv: int
    max_iv: int


class IVCalculationResponse(BaseModel):
    status: str
    iv_ranges: Dict[str, IVRangeResult]


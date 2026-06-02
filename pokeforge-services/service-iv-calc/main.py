import math
import psycopg2
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from psycopg2.extras import RealDictCursor
from strawberry.fastapi import GraphQLRouter

from graphql_engine import schema
from schemas import IVCalculationRequest, IVCalculationResponse, IVRangeResult
from seed_scraper import run_ingestion_pipeline

from database import PokemonRepository

# Authority Matrix for Gen-3 Natures [Increased Stat Column, Decreased Stat Column]
NATURE_MODIFIERS = {
    "Hardy": {"inc": None, "dec": None},
    "Lonely": {"inc": "attack", "dec": "defense"},
    "Brave": {"inc": "attack", "dec": "speed"},
    "Adamant": {"inc": "attack", "dec": "sp_attack"},
    "Naughty": {"inc": "attack", "dec": "sp_defense"},
    "Bold": {"inc": "defense", "dec": "attack"},
    "Docile": {"inc": None, "dec": None},
    "Relaxed": {"inc": "defense", "dec": "speed"},
    "Impish": {"inc": "defense", "dec": "sp_attack"},
    "Lax": {"inc": "defense", "dec": "sp_defense"},
    "Timid": {"inc": "speed", "dec": "attack"},
    "Hasty": {"inc": "speed", "dec": "defense"},
    "Serious": {"inc": "speed", "dec": None},
    "Jolly": {"inc": "speed", "dec": "sp_attack"},
    "Naive": {"inc": "speed", "dec": "sp_defense"},
    "Modest": {"inc": "sp_attack", "dec": "attack"},
    "Mild": {"inc": "sp_attack", "dec": "defense"},
    "Quiet": {"inc": "sp_attack", "dec": "speed"},
    "Bashful": {"inc": "sp_attack", "dec": None},
    "Rash": {"inc": "sp_attack", "dec": "sp_defense"},
    "Calm": {"inc": "sp_defense", "dec": "attack"},
    "Gentle": {"inc": "sp_defense", "dec": "defense"},
    "Sassy": {"inc": "sp_defense", "dec": "speed"},
    "Careful": {"inc": "sp_defense", "dec": "sp_attack"},
    "Quirky": {"inc": "sp_defense", "dec": None},
}


def reverse_engineer_stat_ivs(
    base: int, current_input: int, lvl: int, ev: int, nature_mod: float, is_hp: bool
) -> IVRangeResult:
    matching_ivs = []

    # Loop across all 32 possible individual value points
    for iv in range(0, 32):
        if is_hp:
            # Gen-3 HP Equation Model
            computed = (
                math.floor(((2 * base + iv + math.floor(ev / 4)) * lvl) / 100)
                + lvl
                + 10
            )
        else:
            # Gen-3 Standard Core Stat Equation Model
            computed = math.floor(
                math.floor(((2 * base + iv + math.floor(ev / 4)) * lvl) / 100 + 5)
                * nature_mod
            )

        if computed == current_input:
            matching_ivs.append(iv)

    if not matching_ivs:
        # Fallback safe boundaries if conflicting EV inputs are provided
        return IVRangeResult(min_iv=0, max_iv=31)

    return IVRangeResult(min_iv=matching_ivs[0], max_iv=matching_ivs[-1])


graphql_app = GraphQLRouter(schema)
app = FastAPI(title="PokeForge IV Calculator")
app.include_router(graphql_app, prefix="/graphql")


@app.post("/api/v1/iv/calculate", response_model=IVCalculationResponse)
async def calculate_pokemon_iv(payload: IVCalculationRequest):
    base_data = PokemonRepository.fetch_base_stats_by_id(payload.pokemon_id)

    if not base_data:
        raise HTTPException(
            status_code=404,
            detail=f"Pokemon with id {payload.pokemon_id} was not found",
        )

    nature_rules = NATURE_MODIFIERS.get(payload.nature)
    if not nature_rules:
        raise HTTPException(
            status_code=400, detail=f"Nature {payload.nature} is not valid"
        )

    stat_keys = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"]
    results = {}

    for stat in stat_keys:
        is_hp = stat == "hp"
        base_val = base_data.get(f"base_{stat}")
        pokemon_stat = getattr(payload.stats, stat)
        pokemon_ev = getattr(payload.evs, stat)

        modifier = 1.0

        if not is_hp:
            if nature_rules.get("inc", "") == stat:
                modifier = 1.1
            if nature_rules.get("dec", "") == stat:
                modifier = 0.9

        results[stat] = reverse_engineer_stat_ivs(
            base=base_val,
            current_input=pokemon_stat,
            lvl=payload.level,
            ev=pokemon_ev,
            nature_mod=modifier,
            is_hp=is_hp,
        )

    return IVCalculationResponse(status="success", iv_ranges=results)

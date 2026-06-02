from fastapi import FastAPI, HTTPException
from strawberry.fastapi import GraphQLRouter

from graphql_engine import schema
from schemas import IVCalculationRequest, IVCalculationResponse
from seed_scraper import run_ingestion_pipeline

from database import PokemonRepository
from tools import reverse_engineer_stat_ivs, NATURE_MODIFIERS


graphql_app = GraphQLRouter(schema)
app = FastAPI(title="PokeForge IV Calculator")
app.include_router(graphql_app, prefix="/graphql")


@app.post("/api/v1/iv/calculate", response_model=IVCalculationResponse)
async def calculate_pokemon_iv(payload: IVCalculationRequest):
    base_data = PokemonRepository.fetch_pokemon_by_id(payload.pokemon_id)

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


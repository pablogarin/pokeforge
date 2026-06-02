import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List
from .types import GlobalPokemon
from config import DB_PARAMS


def resolve_global_pokedex() -> List[GlobalPokemon]:
    try:
        conn = psycopg2.connect(**DB_PARAMS, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM global_pokemons ORDER BY id ASC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return [
            GlobalPokemon(
                id=row["id"],
                name=row["name"].capitalize(),
                types=row["types"],
                base_hp=row["base_hp"],
                base_attack=row["base_attack"],
                base_defense=row["base_defense"],
                base_sp_attack=row["base_sp_attack"],
                base_sp_defense=row["base_sp_defense"],
                base_speed=row["base_speed"],
            )
            for row in rows
        ]

    except Exception as err:
        print(f"Error getting pokemons from database: {err}")
        return []

from typing import List, Dict, Optional
from .connection import get_db_cursor


POKEMON_TABLE = "global_pokemons"
POKEMON_ID_FIELD = "id"
MOVES_TABLE = "global_moves"
MOVES_ID_FIELD = "id"


QUERY_SELECT_ALL_POKEMON = (
    f"SELECT * FROM {POKEMON_TABLE} ORDER BY {POKEMON_ID_FIELD} ASC;"
)

QUERY_SELECT_POKEMON_BY_ID = (
    f"SELECT * FROM {POKEMON_TABLE} WHERE {POKEMON_ID_FIELD} = %s;"
)

QUERY_SELECT_MOVES_BY_IDS = (
    f"SELECT * FROM {MOVES_TABLE} WHERE {MOVES_ID_FIELD} = ANY(%s);"
)


class PokemonRepository:
    @staticmethod
    def fetch_all_global_pokemons() -> List[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_ALL_POKEMON)
            return cursor.fetchall()

    @staticmethod
    def fetch_base_stats_by_id(pokemon_id: int) -> Optional[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_POKEMON_BY_ID, (pokemon_id,))
            return cursor.fetchone()

    @staticmethod
    def fetch_moves_by_ids(move_ids: List[int]) -> List[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_MOVES_BY_IDS, (move_ids,))
            return cursor.fetchall()

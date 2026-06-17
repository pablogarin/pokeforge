from typing import Any, List, Dict, Optional, Tuple
from .connection import get_db_cursor
from .models import MoveDomainModel, UserPokemonDomainModel, PokemonDomainModel


def create_upsert_query(
    table: str, field_list: Dict[str, str], id_field: str, exclude_list: List[str]
) -> str:
    return (
        f"INSERT INTO {table} ({','.join(field_list.keys())}) "
        f"VALUES ({','.join(field_list.values())}) "
        f"ON CONFLICT ({id_field}) DO UPDATE SET "
        f"{
            ','.join(
                [
                    f'{key} = EXCLUDED.{key}'
                    for key in field_list.keys()
                    if key not in exclude_list
                ]
            )
        }"
        f" RETURNING *;"
    )


MOVES_TABLE = "global_moves"
MOVES_ID_FIELD = "id"
POKEMON_TABLE = "global_pokemons"
POKEMON_ID_FIELD = "id"
USER_POKEMON_TABLE = "user_pokemon"
USER_POKEMON_ID_FIELD = "id"
USER_POKEMON_USER_ID_FIELD = "user_id"
USER_POKEMON_POKEMON_ID_FIELD = "pokemon_id"
USER_POKEMON_IS_IN_ROOSTER_FIELD = "is_in_rooster"
USER_POKEMON_ORDER_BY = "created_at"
USER_POKEMON_FIELD_LIST = {
    "id": "CASE WHEN %s = -1 THEN nextval('user_pokemon_id_seq') ELSE %s END",
    "user_id": "%s",
    "pokemon_id": "%s",
    "custom_nickname": "%s",
    "level": "%s",
    "gender": "%s::pokemon_gender",
    "nature": "%s::pokemon_nature",
    "is_in_rooster": "%s",
    "current_hp": "%s",
    "current_attack": "%s",
    "current_defense": "%s",
    "current_sp_attack": "%s",
    "current_sp_defense": "%s",
    "current_speed": "%s",
    "iv_range_hp": "%s",
    "iv_range_attack": "%s",
    "iv_range_defense": "%s",
    "iv_range_sp_attack": "%s",
    "iv_range_sp_defense": "%s",
    "iv_range_speed": "%s",
    "known_move_ids": "%s",
}


QUERY_SELECT_ALL_POKEMON = (
    f"SELECT * FROM {POKEMON_TABLE} ORDER BY {POKEMON_ID_FIELD} ASC;"
)

QUERY_SELECT_POKEMON_BY_ID = (
    f"SELECT * FROM {POKEMON_TABLE} WHERE {POKEMON_ID_FIELD} = %s;"
)

QUERY_SELECT_ALL_MOVES = f"SELECT * FROM {MOVES_TABLE};"

POKEMON_FIELD_LIST = {
    "id": "%s",
    "name": "%s",
    "height": "%s",
    "weight": "%s",
    "species_id": "%s",
    "genus": "%s",
    "flavor_text": "%s",
    "types": "%s::pokemon_element_type[]",
    "base_hp": "%s",
    "base_attack": "%s",
    "base_defense": "%s",
    "base_sp_attack": "%s",
    "base_sp_defense": "%s",
    "base_speed": "%s",
    "evolution_chain_id": "%s",
    "evolves_from_species_id": "%s",
}

MOVES_FIELD_LIST = {
    "id": "%s",
    "name": "%s",
    "type": "%s::pokemon_element_type",
    "power": "%s",
    "pp": "%s",
}

QUERY_UPSERT_POKEMON = (
    f"INSERT INTO {POKEMON_TABLE} "
    f"({','.join(POKEMON_FIELD_LIST.keys())}) "
    f"VALUES ({','.join(POKEMON_FIELD_LIST.values())}) "
    f"ON CONFLICT ({POKEMON_ID_FIELD}) DO UPDATE SET "
    f"{
        ','.join(
            [
                f'{key} = EXCLUDED.{key}'
                for key in POKEMON_FIELD_LIST.keys()
                if key is not POKEMON_ID_FIELD
            ]
        )
    };"
)

QUERY_SELECT_MOVES_BY_IDS = (
    f"SELECT * FROM {MOVES_TABLE} WHERE {MOVES_ID_FIELD} = ANY(%s);"
)

QUERY_UPSERT_MOVES = create_upsert_query(
    MOVES_TABLE, MOVES_FIELD_LIST, MOVES_ID_FIELD, [MOVES_ID_FIELD]
)
QUERY_SELECT_ALL_USER_POKEMON = (
    f"SELECT * FROM {USER_POKEMON_TABLE} "
    f"WHERE {USER_POKEMON_USER_ID_FIELD} = %s "
    f"ORDER BY {USER_POKEMON_ORDER_BY} ASC"
)
QUERY_SELECT_ROOSTER_USER_POKEMON = (
    f"SELECT * FROM {USER_POKEMON_TABLE} "
    f"WHERE {USER_POKEMON_USER_ID_FIELD} = %s "
    f"AND {USER_POKEMON_IS_IN_ROOSTER_FIELD} = TRUE "
    f"ORDER BY id ASC"
)

QUERY_UPSERT_USER_POKEMON = (
    f"INSERT INTO {USER_POKEMON_TABLE} ({','.join(USER_POKEMON_FIELD_LIST.keys())}) "
    f"VALUES ({','.join(USER_POKEMON_FIELD_LIST.values())}) "
    f"ON CONFLICT ({USER_POKEMON_ID_FIELD}) DO UPDATE SET "
    f"{
        ','.join(
            [
                f'{key} = EXCLUDED.{key}'
                for key in USER_POKEMON_FIELD_LIST.keys()
                if key
                not in [
                    USER_POKEMON_ID_FIELD,
                    USER_POKEMON_USER_ID_FIELD,
                    USER_POKEMON_POKEMON_ID_FIELD,
                ]
            ]
        )
    }"
    f" RETURNING *;"
)


class PokemonRepository:
    @staticmethod
    def fetch_all_global_pokemons() -> List[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_ALL_POKEMON)
            rows = cursor.fetchall()
            for row in rows:
                if isinstance(row["types"], str):
                    row["types"] = PokemonRepository._sanitize_pokemon_types(
                        row["types"]
                    )
            return rows

    @staticmethod
    def fetch_pokemon_by_id(pokemon_id: int) -> Optional[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_POKEMON_BY_ID, (pokemon_id,))
            row = cursor.fetchone()
            if isinstance(row["types"], str):
                row["types"] = PokemonRepository._sanitize_pokemon_types(row["types"])
            return row

    @staticmethod
    def fetch_pokemon_by_partial_name(search_str: str) -> List[Dict]:
        with get_db_cursor() as cursor:
            search_arg = f"%{search_str}%"
            cursor.execute(
                """
                SELECT *
                FROM global_pokemons pk
                WHERE name ILIKE %s
                OR EXISTS (
                    SELECT 1
                    FROM unnest(pk.types) AS single_type
                    WHERE single_type::text ILIKE %s
                )
                ORDER BY id;
                """,
                (search_arg, search_arg),
            )
            rows = cursor.fetchall()
            for row in rows:
                if isinstance(row["types"], str):
                    row["types"] = PokemonRepository._sanitize_pokemon_types(
                        row["types"]
                    )
            return rows

    @staticmethod
    def fetch_moves_by_ids(move_ids: List[int]) -> List[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_MOVES_BY_IDS, (move_ids,))
            return cursor.fetchall()

    @staticmethod
    def fetch_all_moves() -> List[Dict]:
        with get_db_cursor() as cursor:
            cursor.execute(QUERY_SELECT_ALL_MOVES)
            return cursor.fetchall()

    @staticmethod
    def fetch_user_collection(user_id: int, include_storage: bool) -> List[Dict]:
        with get_db_cursor() as cursor:
            if include_storage:
                cursor.execute(QUERY_SELECT_ALL_USER_POKEMON, (user_id,))
            else:
                cursor.execute(QUERY_SELECT_ROOSTER_USER_POKEMON, (user_id,))
            return cursor.fetchall()

    @staticmethod
    def extract_pokemon_upsert_set_from_model(
        pokemon: UserPokemonDomainModel,
    ) -> Tuple:
        instance_id = pokemon.id if pokemon.id is not None else -1
        return (instance_id, instance_id) + tuple(
            getattr(pokemon, key)
            for key in USER_POKEMON_FIELD_LIST
            if key is not USER_POKEMON_ID_FIELD
        )

    @staticmethod
    def upsert_user_pokemon(pokemon: UserPokemonDomainModel) -> Dict:
        with get_db_cursor() as cursor:
            cursor.execute(
                QUERY_UPSERT_USER_POKEMON,
                PokemonRepository.extract_pokemon_upsert_set_from_model(pokemon),
            )
            return cursor.fetchone()

    @staticmethod
    def upsert_pokemon(pokemon: PokemonDomainModel) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                QUERY_UPSERT_POKEMON,
                tuple(getattr(pokemon, key) for key in POKEMON_FIELD_LIST.keys()),
            )

    @staticmethod
    def upsert_move(move: MoveDomainModel) -> None:
        with get_db_cursor() as cursor:
            cursor.execute(
                QUERY_UPSERT_MOVES,
                tuple(getattr(move, key) for key in MOVES_FIELD_LIST.keys()),
            )

    @staticmethod
    def fetch_user(user_id: int) -> Dict:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s;", (user_id,))
            return cursor.fetchone()

    @staticmethod
    def _sanitize_pokemon_types(types: str) -> list:
        return [t.strip() for t in types.replace("{", "").replace("}", "").split(",")]

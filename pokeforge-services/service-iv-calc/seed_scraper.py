import psycopg2
import pandas as pd
import requests
from io import StringIO

# 1. Database Connection String Parameters
DB_PARAMS = {
    "host": "localhost",
    "port": 5432,
    "user": "forge_admin",
    "password": "forge_secure_password123",
    "database": "pokeforge",
}

# 2. Raw Sourcing GitHub Target Endpoints
POKEMON_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon.csv"
STATS_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_stats.csv"
TYPES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_types.csv"
TYPES_PROSE_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/type_names.csv"
PAST_TYPES_CSV_URL = "https://github.com/PokeAPI/pokeapi/raw/refs/heads/master/data/v2/csv/pokemon_types_past.csv"


def fetch_csv_as_df(url: str) -> pd.DataFrame:
    response = requests.get(url)
    response.raise_for_status()
    return pd.read_csv(StringIO(response.text))


SURPRISED_PIKACHU = """
⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣠⣤⣶⣶
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣾⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡏⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿
⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠁⠀⣿
⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠙⠿⠿⠿⠻⠿⠿⠟⠿⠛⠉⠀⠀⠀⠀⠀⣸⣿
⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣴⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢰⣹⡆⠀⠀⠀⠀⠀⠀⣭⣷⠀⠀⠀⠸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠉⠀⠀⠤⠄⠀⠀⠀⠉⠁⠀⠀⠀⠀⢿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⢾⣿⣷⠀⠀⠀⠀⡠⠤⢄⠀⠀⠀⠠⣿⣿⣷⠀⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡀⠉⠀⠀⠀⠀⠀⢄⠀⢀⠀⠀⠀⠀⠉⠉⠁⠀⠀⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿
"""


def run_ingestion_pipeline():
    print(SURPRISED_PIKACHU)
    print("Streaming master catalogs from PokeAPI repository source blocks...")

    # Download raw data frames
    df_pkmn = fetch_csv_as_df(POKEMON_CSV_URL)
    df_stats = fetch_csv_as_df(STATS_CSV_URL)
    df_types = fetch_csv_as_df(TYPES_CSV_URL)
    df_type_names = fetch_csv_as_df(TYPES_PROSE_URL)
    df_past_types = fetch_csv_as_df(PAST_TYPES_CSV_URL)

    # Filter out everything past Generation 3 (National Dex limit for FireRed is Deoxys = 386)
    df_pkmn = df_pkmn[df_pkmn["id"] <= 386]

    # Establish connection mapping hooks into local running PostgreSQL container
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()

    print("Beginning structural parse operations into Postgres context...")
    try:
        for _, row in df_pkmn.iterrows():
            pkmn_id = int(row["id"])
            pkmn_name = str(row["identifier"]).lower()

            past_type = df_past_types[
                (df_past_types["pokemon_id"] == pkmn_id)
                & (df_past_types["generation_id"] == 5)
            ]

            # Extract types for this individual id
            if not past_type.empty:
                pkmn_types_raw = past_type.sort_values(by="slot")
            else:
                pkmn_types_raw = df_types[
                    df_types["pokemon_id"] == pkmn_id
                ].sort_values(by="slot")
            type_list = []
            for _, type_row in pkmn_types_raw.iterrows():
                type_id = type_row["type_id"]
                # Cross-reference the textual string name for the type id (e.g., 'fire')
                type_str = df_type_names[
                    (df_type_names["type_id"] == type_id)
                    & (df_type_names["local_language_id"] == 9)
                ]["name"].values[0]
                type_list.append(
                    type_str.capitalize()
                )  # Formats nicely to capitalize (e.g. 'Fire')

            # Extract base stats (Stat ID Mapping: 1=HP, 2=ATK, 3=DEF, 4=SP_ATK, 5=SP_DEF, 6=SPEED)
            pkmn_stats = df_stats[df_stats["pokemon_id"] == pkmn_id]

            base_hp = int(pkmn_stats[pkmn_stats["stat_id"] == 1]["base_stat"].values[0])
            base_atk = int(
                pkmn_stats[pkmn_stats["stat_id"] == 2]["base_stat"].values[0]
            )
            base_def = int(
                pkmn_stats[pkmn_stats["stat_id"] == 3]["base_stat"].values[0]
            )
            base_sp_atk = int(
                pkmn_stats[pkmn_stats["stat_id"] == 4]["base_stat"].values[0]
            )
            base_sp_def = int(
                pkmn_stats[pkmn_stats["stat_id"] == 5]["base_stat"].values[0]
            )
            base_speed = int(
                pkmn_stats[pkmn_stats["stat_id"] == 6]["base_stat"].values[0]
            )

            # Execute SQL Upsert query into your schema
            cursor.execute(
                """
                INSERT INTO global_pokemons 
                    (id, name, types, base_hp, base_attack, base_defense, base_sp_attack, base_sp_defense, base_speed)
                VALUES (%s, %s, %s::pokemon_element_type[], %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    types = EXCLUDED.types,
                    base_hp = EXCLUDED.base_hp,
                    base_attack = EXCLUDED.base_attack,
                    base_defense = EXCLUDED.base_defense,
                    base_sp_attack = EXCLUDED.base_sp_attack,
                    base_sp_defense = EXCLUDED.base_sp_defense,
                    base_speed = EXCLUDED.base_speed;
            """,
                (
                    pkmn_id,
                    pkmn_name,
                    type_list,
                    base_hp,
                    base_atk,
                    base_def,
                    base_sp_atk,
                    base_sp_def,
                    base_speed,
                ),
            )

        conn.commit()
        print(
            f"Success! Ingested and synchronized exactly {len(df_pkmn)} Generation 3 reference entries."
        )

    except Exception as e:
        conn.rollback()
        print(f"Ingestion crashed: {e}")
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    run_ingestion_pipeline()

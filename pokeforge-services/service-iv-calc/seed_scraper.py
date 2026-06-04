import math
import psycopg2
import pandas as pd
import requests
from io import StringIO
from database import PokemonRepository
from database.models import PokemonDomainModel

# 2. Raw Sourcing GitHub Target Endpoints
POKEMON_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon.csv"
STATS_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_stats.csv"
TYPES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_types.csv"
TYPES_PROSE_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/type_names.csv"
PAST_TYPES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_types_past.csv"
FLAVOR_TEXT_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_species_flavor_text.csv"
POKEMON_SPECIES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_species.csv"
POKEMON_NAME_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/refs/heads/master/data/v2/csv/pokemon_species_names.csv"

# 6,10,9 Charizard Flavor Text
LANGUAGE_ID = 9
VERSION_ID = 10


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
    df_flavor_text = fetch_csv_as_df(FLAVOR_TEXT_CSV_URL)
    df_pokemon_species = fetch_csv_as_df(POKEMON_SPECIES_CSV_URL)
    df_pokemon_names = fetch_csv_as_df(POKEMON_NAME_CSV_URL)

    # Filter out everything past Generation 3 (National Dex limit for FireRed is Deoxys = 386)
    df_pkmn = df_pkmn[df_pkmn["id"] <= 386]

    print("Beginning structural parse operations into Postgres context...")
    try:
        for _, row in df_pkmn.iterrows():
            pkmn_id = int(row["id"])
            pkmn_name = str(row["identifier"]).lower()
            pkmn_species = int(row["species_id"])
            pkmn_height = int(row["height"])
            pkmn_weight = int(row["weight"])
            pkmn_evolution_chain = int(
                df_pokemon_species[(df_pokemon_species["id"] == pkmn_id)][
                    "evolution_chain_id"
                ].values[0]
            )
            evolves_from = df_pokemon_species[(df_pokemon_species["id"] == pkmn_id)][
                "evolves_from_species_id"
            ].values[0]
            pkmn_evolves_from = None if math.isnan(evolves_from) else int(evolves_from)

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
                    & (df_type_names["local_language_id"] == LANGUAGE_ID)
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
            flavor_text = df_flavor_text[
                (df_flavor_text["species_id"] == pkmn_species)
                & (df_flavor_text["version_id"] == VERSION_ID)
                & (df_flavor_text["language_id"] == LANGUAGE_ID)
            ]["flavor_text"].values[0]

            genus = df_pokemon_names[
                (df_pokemon_names["pokemon_species_id"] == pkmn_species)
                & (df_pokemon_names["local_language_id"] == LANGUAGE_ID)
            ]["genus"].values[0]

            # Execute upsert operation
            pokemon = PokemonDomainModel(
                id=pkmn_id,
                name=pkmn_name,
                height=pkmn_height,
                weight=pkmn_weight,
                species_id=pkmn_species,
                genus=genus,
                flavor_text=flavor_text,
                types=type_list,
                base_hp=base_hp,
                base_attack=base_atk,
                base_defense=base_def,
                base_sp_attack=base_sp_atk,
                base_sp_defense=base_sp_def,
                base_speed=base_speed,
                evolution_chain_id=pkmn_evolution_chain,
                evolves_from_species_id=int(pkmn_evolves_from)
                if pkmn_evolves_from
                else None,
            )
            PokemonRepository.upsert_pokemon(pokemon)
        print(
            f"Success! Ingested and synchronized exactly {len(df_pkmn)} Generation 3 reference entries."
        )

    except Exception as e:
        print(f"Ingestion crashed: {e}")


if __name__ == "__main__":
    run_ingestion_pipeline()

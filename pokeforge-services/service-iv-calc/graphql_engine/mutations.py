import strawberry
from typing import List, Optional
from database import PokemonRepository
from database.models import UserPokemonDomainModel
from .types import UserPokemon

# Import the math formulas from your main script entrypoint
from tools import reverse_engineer_stat_ivs, NATURE_MODIFIERS


@strawberry.input
class StatInput:
    hp: int
    attack: int
    defense: int
    sp_attack: int
    sp_defense: int
    speed: int


@strawberry.input
class UpsertPokemonInput:
    id: Optional[int] = None
    pokemon_id: int
    custom_nickname: Optional[str] = strawberry.UNSET
    level: int
    gender: str
    nature: str
    is_in_rooster: bool
    stats: StatInput
    known_move_ids: List[int]
    # Made completely optional! If omitted, the engine auto-calculates before insertion
    iv_ranges: Optional[StatInput] = None


@strawberry.type
class Mutation:
    @strawberry.mutation
    def upsertPokemon(self, input: UpsertPokemonInput) -> UserPokemon:
        """Type-safe Mutation that auto-calculates missing IV ranges and returns the complete entity."""
        mock_user_id = 1

        if len(input.known_move_ids) > 4:
            raise ValueError("A Pokémon cannot maintain more than 4 active moves.")

        # 1. Fetch base reference stats from repository to execute the calculation formulas
        base_data = PokemonRepository.fetch_pokemon_by_id(input.pokemon_id)
        if not base_data:
            raise ValueError("Requested Pokémon ID not found in database registry.")

        nature_rules = NATURE_MODIFIERS.get(input.nature)
        if not nature_rules:
            raise ValueError("Invalid Nature parameter supplied.")

        # 2. RESOLVE OR AUTOMATICALLY CALCULATE IV BOUNDS ON THE FLY
        iv_ranges_computed = {}
        stats_keys = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"]

        for stat in stats_keys:
            if input.iv_ranges is not None:
                # If the client already knows the exact IV points, map them straight over
                val = getattr(input.iv_ranges, stat)
                iv_ranges_computed[stat] = [val, val]
            else:
                # AUTOMATION STEP: Trigger brute-force math loop dynamically
                is_hp = stat == "hp"
                base_val = base_data[f"base_{stat}"]
                user_stat = getattr(input.stats, stat)

                modifier = 1.0
                if not is_hp:
                    if nature_rules["inc"] == stat:
                        modifier = 1.1
                    elif nature_rules["dec"] == stat:
                        modifier = 0.9

                # Call calculation engine loop
                range_res = reverse_engineer_stat_ivs(
                    base=base_val,
                    current_input=user_stat,
                    lvl=input.level,
                    ev=0,
                    nature_mod=modifier,
                    is_hp=is_hp,  # Defaulting to 0 EVs for freshly caught wild entries
                )
                iv_ranges_computed[stat] = [range_res.min_iv, range_res.max_iv]

        nickname = (
            input.custom_nickname
            if input.custom_nickname is not strawberry.UNSET
            else None
        )

        # 3. Assemble and dispatch domain tracking object
        domain_model = UserPokemonDomainModel(
            id=input.id,
            user_id=mock_user_id,
            pokemon_id=input.pokemon_id,
            custom_nickname=nickname,
            level=input.level,
            gender=input.gender,
            nature=input.nature,
            is_in_rooster=input.is_in_rooster,
            current_hp=input.stats.hp,
            current_attack=input.stats.attack,
            current_defense=input.stats.defense,
            current_sp_attack=input.stats.sp_attack,
            current_sp_defense=input.stats.sp_defense,
            current_speed=input.stats.speed,
            iv_range_hp=iv_ranges_computed["hp"],
            iv_range_attack=iv_ranges_computed["attack"],
            iv_range_defense=iv_ranges_computed["defense"],
            iv_range_sp_attack=iv_ranges_computed["sp_attack"],
            iv_range_sp_defense=iv_ranges_computed["sp_defense"],
            iv_range_speed=iv_ranges_computed["speed"],
            known_move_ids=input.known_move_ids,
        )

        # 4. Save and return full Graph Entity
        row = PokemonRepository.upsert_user_pokemon(domain_model)
        return UserPokemon(
            id=row["id"],
            user_id=row["user_id"],
            pokemon_id=row["pokemon_id"],
            custom_nickname=row["custom_nickname"],
            level=row["level"],
            gender=row["gender"],
            nature=row["nature"],
            is_in_rooster=row["is_in_rooster"],
            current_hp=row["current_hp"],
            current_attack=row["current_attack"],
            current_defense=row["current_defense"],
            current_sp_attack=row["current_sp_attack"],
            current_sp_defense=row["current_sp_defense"],
            current_speed=row["current_speed"],
            iv_range_hp=row["iv_range_hp"],
            iv_range_attack=row["iv_range_attack"],
            iv_range_defense=row["iv_range_defense"],
            iv_range_sp_attack=row["iv_range_sp_attack"],
            iv_range_sp_defense=row["iv_range_sp_defense"],
            iv_range_speed=row["iv_range_speed"],
            known_move_ids=row["known_move_ids"],
        )

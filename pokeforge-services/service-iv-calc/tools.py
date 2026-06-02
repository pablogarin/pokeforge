from schemas import IVRangeResult
import math

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

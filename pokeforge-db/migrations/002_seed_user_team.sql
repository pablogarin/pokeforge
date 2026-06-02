-- =========================================================================
-- PHASE 1: ACCOUNT INFRASTRUCTURE PROVISIONING
-- =========================================================================

-- Ensure user with ID = 1 exists as a global anchor account
INSERT INTO users (id, email, google_id, display_name, avatar_url)
VALUES (
    1, 
    'ash.ketchum@pallet.local', 
    'google-oauth2|123456789', 
    'Ash Ketchum', 
    'https://images.local'
)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;

-- Purge pre-existing test captures to keep the seed script completely idempotent
DELETE FROM user_pokemon WHERE user_id = 1;


-- =========================================================================
-- PHASE 2: TEAM PARTY ROSTER AND BOX STORAGE SEEDING
-- =========================================================================

-- Instance A: Charizard (Active Battle Roster, Perfect IV Ranges)
INSERT INTO user_pokemon (
    user_id, pokemon_id, custom_nickname, level, gender, nature, is_in_rooster,
    current_hp, current_attack, current_defense, current_sp_attack, current_sp_defense, current_speed,
    iv_range_hp, iv_range_attack, iv_range_defense, iv_range_sp_attack, iv_range_sp_defense, iv_range_speed,
    known_move_ids
) VALUES (
    1, 6, 'Chomper', 50, 'Male', 'Adamant', TRUE,
    153, 149, 98, 102, 105, 120,
    ARRAY[31, 31], ARRAY[31, 31], ARRAY[31, 31], ARRAY[22, 23], ARRAY[31, 31], ARRAY[31, 31],
    ARRAY[10, 52, 315] -- Matches reference global_moves IDs: Scratch, Ember, Overheat
);

-- Instance B: Pikachu (Active Battle Roster)
INSERT INTO user_pokemon (
    user_id, pokemon_id, custom_nickname, level, gender, nature, is_in_rooster,
    current_hp, current_attack, current_defense, current_sp_attack, current_sp_defense, current_speed,
    iv_range_hp, iv_range_attack, iv_range_defense, iv_range_sp_attack, iv_range_sp_defense, iv_range_speed,
    known_move_ids
) VALUES (
    1, 25, 'Sparky', 25, 'Male', 'Timid', TRUE,
    60, 35, 25, 42, 32, 68,
    ARRAY[10, 15], ARRAY[18, 22], ARRAY[5, 12], ARRAY[25, 29], ARRAY[14, 20], ARRAY[28, 31],
    ARRAY[84] -- Thunderbolt
);

-- Instance C: Bulbasaur (Active Battle Roster)
INSERT INTO user_pokemon (
    user_id, pokemon_id, custom_nickname, level, gender, nature, is_in_rooster,
    current_hp, current_attack, current_defense, current_sp_attack, current_sp_defense, current_speed,
    iv_range_hp, iv_range_attack, iv_range_defense, iv_range_sp_attack, iv_range_sp_defense, iv_range_speed,
    known_move_ids
) VALUES (
    1, 1, 'Bulby', 12, 'Female', 'Modest', TRUE,
    32, 18, 20, 28, 24, 19,
    ARRAY[15, 22], ARRAY[8, 14], ARRAY[19, 25], ARRAY[30, 31], ARRAY[20, 26], ARRAY[11, 17],
    ARRAY[33, 22] -- Tackle, Vine Whip
);

-- Instance D: Stored Squirtle (Stored inside PC storage, is_in_rooster = FALSE)
INSERT INTO user_pokemon (
    user_id, pokemon_id, custom_nickname, level, gender, nature, is_in_rooster,
    current_hp, current_attack, current_defense, current_sp_attack, current_sp_defense, current_speed,
    iv_range_hp, iv_range_attack, iv_range_defense, iv_range_sp_attack, iv_range_sp_defense, iv_range_speed,
    known_move_ids
) VALUES (
    1, 7, 'Bubbles', 5, 'Male', 'Bold', FALSE,
    19, 10, 13, 11, 12, 9,
    ARRAY[20, 31], ARRAY[10, 19], ARRAY[25, 31], ARRAY[12, 24], ARRAY[15, 28], ARRAY[8, 21],
    ARRAY[33, 55] -- Tackle, Water Gun
);


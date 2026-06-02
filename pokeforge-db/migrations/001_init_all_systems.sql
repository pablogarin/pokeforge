-- =========================================================================
-- PHASE 1: EXTENSIONS & ENUMS DEFINITIONS (IMMUTABLE GAME DATA)
-- =========================================================================

-- Enable case-insensitive text extension for safe email handling
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TYPE pokemon_gender AS ENUM ('Male', 'Female', 'Genderless');

CREATE TYPE pokemon_nature AS ENUM (
    'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
    'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
    'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
    'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
    'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
);

CREATE TYPE pokemon_element_type AS ENUM (
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark'
);

-- =========================================================================
-- PHASE 2: CORE RELATION TABLE SCHEMAS
-- =========================================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email CITEXT UNIQUE NOT NULL, 
    google_id VARCHAR(255) UNIQUE NOT NULL, -- Core identifier from Google identity provider
    display_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE global_moves (
    id INT PRIMARY KEY, -- Maps directly to PokeAPI Move ID records
    name VARCHAR(100) NOT NULL,
    type pokemon_element_type NOT NULL, -- Decoupled global reusable enum
    power INT,
    pp INT
);

CREATE TABLE global_pokemons (
    id INT PRIMARY KEY, -- Maps directly to National Pokédex Index IDs
    name VARCHAR(100) UNIQUE NOT NULL,
    types pokemon_element_type[] NOT NULL CHECK (cardinality(types) BETWEEN 1 AND 2), -- Safe dual-type assignment
    base_hp INT NOT NULL,
    base_attack INT NOT NULL,
    base_defense INT NOT NULL,
    base_sp_attack INT NOT NULL,
    base_sp_defense INT NOT NULL,
    base_speed INT NOT NULL
);

CREATE TABLE user_pokemon (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    pokemon_id INT REFERENCES global_pokemons(id) ON DELETE RESTRICT NOT NULL,
    custom_nickname VARCHAR(100),
    level INT NOT NULL CHECK (level BETWEEN 1 AND 100),
    gender pokemon_gender NOT NULL,
    nature pokemon_nature NOT NULL,
    
    -- ROSTER STATUS TRACKING
    -- TRUE = Active 6-Slot Party, FALSE = Stored in PC System
    is_in_rooster BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Current Raw Input Stats
    current_hp INT NOT NULL CHECK (current_hp > 0),
    current_attack INT NOT NULL CHECK (current_attack > 0),
    current_defense INT NOT NULL CHECK (current_defense > 0),
    current_sp_attack INT NOT NULL CHECK (current_sp_attack > 0),
    current_sp_defense INT NOT NULL CHECK (current_sp_defense > 0),
    current_speed INT NOT NULL CHECK (current_speed > 0),

    -- Calculated Result Range Arrays: Exact structural parameters tracking [min_iv, max_iv]
    iv_range_hp INT[] NOT NULL CHECK (cardinality(iv_range_hp) = 2),
    iv_range_attack INT[] NOT NULL CHECK (cardinality(iv_range_attack) = 2),
    iv_range_defense INT[] NOT NULL CHECK (cardinality(iv_range_defense) = 2),
    iv_range_sp_attack INT[] NOT NULL CHECK (cardinality(iv_range_sp_attack) = 2),
    iv_range_sp_defense INT[] NOT NULL CHECK (cardinality(iv_range_sp_defense) = 2),
    iv_range_speed INT[] NOT NULL CHECK (cardinality(iv_range_speed) = 2),

    -- Active Known Learned Moves Array Configuration
    known_move_ids INT[] DEFAULT '{}'::INT[] CHECK (cardinality(known_move_ids) <= 4),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- PHASE 3: PERFORMANCE INDEXES & INTEGRITY CONSTRAINTS
-- =========================================================================

-- Optimize routine lookup queries scanning a specific user's complete collection
CREATE INDEX idx_user_pokemon_user_id ON user_pokemon(user_id);

-- Strategic function to handle active team sizing enforcement at database level
CREATE OR REPLACE FUNCTION enforce_rooster_limit() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_in_rooster = TRUE THEN
        IF (SELECT COUNT(*) FROM user_pokemon WHERE user_id = NEW.user_id AND is_in_rooster = TRUE AND id != NEW.id) >= 6 THEN
            RAISE EXCEPTION 'Party Overflow error: Active battle roster is limited to a maximum of 6 slots.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind trigger boundary rules to block excess updates or insertions
CREATE TRIGGER trg_limit_user_rooster
BEFORE INSERT OR UPDATE OF is_in_rooster ON user_pokemon
FOR EACH ROW EXECUTE FUNCTION enforce_rooster_limit();


-- =========================================================================
-- PHASE 4: REFERENCE METADATA POPULATION
-- =========================================================================

-- Seed standard baseline metrics for iconic Gen-3 starters
INSERT INTO global_pokemons (id, name, types, base_hp, base_attack, base_defense, base_sp_attack, base_sp_defense, base_speed) VALUES
(1, 'bulbasaur', ARRAY['Grass', 'Poison']::pokemon_element_type[], 45, 49, 49, 65, 65, 45),
(2, 'ivysaur', ARRAY['Grass', 'Poison']::pokemon_element_type[], 60, 62, 63, 80, 80, 60),
(3, 'venusaur', ARRAY['Grass', 'Poison']::pokemon_element_type[], 80, 82, 83, 100, 100, 80),
(4, 'charmander', ARRAY['Fire']::pokemon_element_type[], 39, 52, 43, 60, 50, 65),
(5, 'charmeleon', ARRAY['Fire']::pokemon_element_type[], 58, 64, 58, 80, 65, 80),
(6, 'charizard', ARRAY['Fire', 'Flying']::pokemon_element_type[], 78, 84, 78, 109, 85, 100),
(7, 'squirtle', ARRAY['Water']::pokemon_element_type[], 44, 48, 65, 50, 64, 43),
(8, 'wartortle', ARRAY['Water']::pokemon_element_type[], 59, 63, 80, 65, 80, 58),
(9, 'blastoise', ARRAY['Water']::pokemon_element_type[], 79, 83, 100, 85, 105, 78),
(25, 'pikachu', ARRAY['Electric']::pokemon_element_type[], 35, 55, 30, 50, 40, 90);

-- Seed highly encountered baseline moves
INSERT INTO global_moves (id, name, type, power, pp) VALUES
(10, 'scratch', 'Normal', 40, 35),
(22, 'vine-whip', 'Grass', 35, 10),
(33, 'tackle', 'Normal', 35, 35),
(52, 'ember', 'Fire', 40, 25),
(55, 'water-gun', 'Water', 40, 25),
(84, 'thunderbolt', 'Electric', 95, 15),
(315, 'overheat', 'Fire', 140, 5);


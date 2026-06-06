import { z } from 'zod';

export const PokemonSchema = z.object({
    id: z.number(),
    name: z.string(),
    height: z.number(),
    weight: z.number(),
    speciesId: z.number(),
    genus: z.string(),
    flavorText: z.string(),
    types: z.array(z.string()),
    baseHp: z.number(),
    baseAttack: z.number(),
    baseDefense: z.number(),
    baseSpAttack: z.number(),
    baseSpDefense: z.number(),
    baseSpeed: z.number()
});

export const UserPokemonSchema = z.object({
    id: z.optional(z.number()),
    pokemonId: z.number(),
    customNickname: z.optional(z.string()),
    level: z.number(),
    gender: z.enum(['Male', 'Female']),
    nature: z.string(),
    isInRooster: z.boolean(),
    currentHp: z.number(),
    currentAttack: z.number(),
    currentDefense: z.number(),
    currentSpAttack: z.number(),
    currentSpDefense: z.number(),
    currentSpeed: z.number(),
    pokemonReference: z.optional(PokemonSchema)
});

export type Pokemon = z.infer<typeof PokemonSchema>;

export type UserPokemon = z.infer<typeof UserPokemonSchema>;

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

const MoveSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    power: z.number(),
    pp: z.number()
});

export const UserPokemonSchema = z.object({
    id: z.optional(z.number()),
    pokemonId: z.number({
        error: "You must select a pokemon first"
    }),
    customNickname: z.optional(z.string()),
    level: z.number({
        error: "Level is needed"
    }),
    gender: z.enum(['Male', 'Female']),
    nature: z.string({
        error: "Nature is needed"
    }),
    isInRooster: z.boolean(),
    currentHp: z.number({
        error: "HP is needed"
    }),
    currentAttack: z.number({
        error: "Attack is needed"
    }),
    currentDefense: z.number({
        error: "Defense is needed"
    }),
    currentSpAttack: z.number({
        error: "Sp. Attack is needed"
    }),
    currentSpDefense: z.number({
        error: "Sp. Defense is needed"
    }),
    currentSpeed: z.number({
        error: "Speed is needed"
    }),
    pokemonReference: z.optional(PokemonSchema),
    knownMoveIds: z.optional(z.array(z.number())),
    knownMoves: z.optional(z.array(MoveSchema))
});

export type Pokemon = z.infer<typeof PokemonSchema>;

export type UserPokemon = z.infer<typeof UserPokemonSchema>;

export type Move = z.infer<typeof MoveSchema>;

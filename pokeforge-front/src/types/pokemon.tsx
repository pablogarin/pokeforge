export type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    speciesId: number;
    genus: string;
    flavorText: string;
    types: { types: string[] };
    baseHp: number;
    baseAttack: number;
    baseDefense: number;
    baseSpAttack: number;
    baseSpDefense: number;
    baseSpeed: number;
}

export type UserPokemon = {
    id: number,
    userId: number,
    pokemonId: number,
    customNickname: string,
    level: number,
    gender: 'male' | 'female',
    nature: string,
    pokemonReference: Pokemon
}

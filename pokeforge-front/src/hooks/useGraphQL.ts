import { useState, useCallback } from 'react';
import { type Move, type Pokemon, type UserPokemon } from '../types/pokemon';


export type Response<T> = {
    type: string;
    data: T;
}

interface GraphQLState<T> {
    data: Response<T> | null;
    error: string | null;
    loading: boolean;
}

export const querySearch = `
query SearchPokemon($search: String!) {
    getPokemonByName(query: $search) {
        id
        name
        height
        weight
        speciesId
        genus
        flavorText
        types
        baseHp
        baseAttack
        baseDefense
        baseSpAttack
        baseSpDefense
        baseSpeed
    }
}`

export const upsertQuery = `
    mutation ($input: UpsertPokemonInput!) {
        upsertPokemon(input: $input) {
            id
            customNickname
            ivRangeAttack
            ivRangeSpeed
            knownMoves {
                name
                type
            }
            pokemonReference {
                name
                baseSpeed
            }
        }
    }
`

export const queryAll = `
query {
    getGlobalPokedex {
        id
        name
        height
        weight
        speciesId
        genus
        flavorText
        types
        baseHp
        baseAttack
        baseDefense
        baseSpAttack
        baseSpDefense
        baseSpeed
    }
}`;

export const queryMoves = `
query {
    getGlobalMoves {
        id
        name
        type
        power
        pp
    }
}`;

export const queryGetMyCollection = `
query {
  getMyCollection {
    id
    customNickname
    level
    gender
    nature
    isInRooster
    currentHp
    currentAttack
    currentDefense
    currentSpAttack
    currentSpDefense
    currentSpeed
    ivRangeHp
    ivRangeAttack
    ivRangeDefense
    ivRangeSpAttack
    ivRangeSpDefense
    ivRangeSpeed
    knownMoves {
      name
      type
      power
      pp
    }
    pokemonReference {
      id
      name
      types
      speciesId
    }
  }
}`;

export const queryFetchUserPokemon = `
query GetUserPokemon($pokemonId: Int!) {
    getUserPokemon(pokemonId: $pokemonId) {
        id
        customNickname
        level
        gender
        nature
        isInRooster
        currentHp
        currentAttack
        currentDefense
        currentSpAttack
        currentSpDefense
        currentSpeed
        ivRangeHp
        ivRangeAttack
        ivRangeDefense
        ivRangeSpAttack
        ivRangeSpDefense
        ivRangeSpeed
        knownMoves {
          name
          type
          power
          pp
        }
        pokemonReference {
          id
          name
          types
          height
          weight
          speciesId
        }
      }
}`;

const typeMap = {
    'getGlobalPokedex': 'Pokemon[]',
    'getGlobalMoves': 'Move[]',
    'getPokemonByName': 'Pokemon[]',
    'getMyCollection': 'UserPokemon[]',
    'getUserPokemon': 'UserPokemon'
}

type GraphQLResponse = {
    getGlobalPokedex?: Pokemon[];
    getGlobalMoves?: Move[];
    getPokemonByName?: Pokemon[];
    getMyCollection?: UserPokemon[];
    getUserPokemon?: UserPokemon;
}

export function useGraphQL<T = any>() {
    const [state, setState] = useState<GraphQLState<T>>({
        data: null,
        error: null,
        loading: false
    });

    const extractDataAndType = (data: GraphQLResponse) => {
        for (const queryName in typeMap) {
            if (data[queryName]) {
                return { data: data[queryName] as T, type: typeMap[queryName] };
            }
        }
    }

    const executeQuery = useCallback(async (query: string, variables: Record<string, any> = {}) => {
        setState({ data: null, error: null, loading: true });

        try {
            const response = await fetch("http://localhost:8000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            const json = await response.json();
            const parsedData = extractDataAndType(json.data);
            setState({ data: parsedData, error: json.errorMsg, loading: false });
        } catch (err) {
            console.error(err);
            setState({ data: null, error: err, loading: false });
        }
    }, []);
    return { ...state, executeQuery };
}

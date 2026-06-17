import { useState, useCallback } from 'react';

interface GraphQLState<T> {
    data: T | null;
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

export function useGraphQL<T = any>() {
    const [state, setState] = useState<GraphQLState<T>>({
        data: null,
        error: null,
        loading: false
    });

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
            setState({ data: json.data, error: json.errorMsg, loading: false });
        } catch (err) {
            console.error(err);
        }
    }, []);
    return { ...state, executeQuery };
}

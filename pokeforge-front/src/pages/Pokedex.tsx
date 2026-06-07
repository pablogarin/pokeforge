import { Loader2, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
// Custom components
import Dialog from '../components/Dialog';
import ElementTypes from '../components/ElementTypes';
import PokemonImg from '../components/PokemonImg';
import PokemonCard from '../components/PokemonCard';
import { useGraphQL } from '../hooks/useGraphQL';
import { type Pokemon } from '../types/pokemon';

type Response = {
    getGlobalPokedex: Pokemon[] | undefined;
    getPokemonByName: Pokemon[] | undefined;
}

const queryAll = `
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

const querySearch = `
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

const extractResultFromQuery = (data: Response | null): Pokemon[] => {
    if (!data) return [];
    if (data.getGlobalPokedex !== undefined) return data.getGlobalPokedex;
    if (data.getPokemonByName !== undefined) return data.getPokemonByName;
};

const Pokedex = () => {
    const { data, error, loading, executeQuery } = useGraphQL();
    const [search, setSearch] = useState<string | null>(null);
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [showPokemonCard, setShowPokemonCard] = useState<boolean>(true);
    const pokemonList = extractResultFromQuery(data);

    useEffect(() => {
        if (!search) {
            executeQuery(queryAll);
            return;
        }
        executeQuery(querySearch, { search });
    }, [search, executeQuery]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentSearch = e.currentTarget.value;
        if (currentSearch == search) return;
        setSearch(currentSearch);
    }

    const handlePokemonClick = (selectedPokemon: Pokemon) => {
        setShowPokemonCard(true);
        setPokemon(selectedPokemon);
    }

    return (
        <div className="flex flex-1 flex-col">
            {error && (
                <Dialog title="Error" body="Something happened!" hasMore={false} />
            )}
            {!!pokemon && showPokemonCard && (
                <div onClick={() => setShowPokemonCard(false)} >
                    <PokemonCard pokemon={pokemon} />
                </div>
            )}
            <div className="w-full">
                <label htmlFor="search" className="mb-2 text-sm font-medium sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Search color="#3337" />
                    </div>
                    <input type="text" name="search" className="block w-full p-3 ps-16 outline-none bg-slate-400 text-heading text-sm rounded-base focus:ring-brand focus:border-brand placeholder:text-body placeholder:text-gray-500" placeholder="SEARCH FOR NAME OR TYPE" onChange={onChangeHandler} />
                </div>
            </div>
            <div className="flex-1 w-full overflow-y-auto pt-12 scrollbar-width-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {loading && (
                    <div className="bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-sm">
                        <Loader2 className="animate-spin text-amber-400" size={32} />
                    </div>
                )}
                {!loading && (<div className="w-full">
                    <table className="w-full table-auto border-colapse">
                        <thead className="bg-slate-900 text-left">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2">No</th>
                                <th className="whitespace-nowrap px-4 py-2">Pokemon</th>
                                <th className="whitespace-nowrap px-4 py-2">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map((pokemon: Pokemon) => (
                                <tr key={pokemon.id} onClick={() => handlePokemonClick(pokemon)}>
                                    <td className="whitespace-nowrap px-4 py-2">No{String(pokemon.id).padStart(3, '0')}</td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <div className="flex items-center justify-start">
                                            <PokemonImg pokemonId={pokemon.id} height="60" width="60" isIcon={true} />
                                            <div className="pl-4">{pokemon.name.toUpperCase()}</div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <ElementTypes types={pokemon.types} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}
            </div>
        </div >
    );
}

export default Pokedex;


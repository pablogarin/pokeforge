import { useGraphQL } from '../hooks/useGraphQL';
import { useEffect, useState } from 'react';
import { type Pokemon } from '../types/pokemon';
import PokemonImg from '../components/PokemonImg';
import { Loader2 } from 'lucide-react';
import PokemonCard from '../components/PokemonCard';

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

    const onChangeHandler = (e) => {
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
            {!!pokemon && showPokemonCard && (
                <div onClick={() => setShowPokemonCard(false)} >
                    <PokemonCard pokemon={pokemon} />
                </div>
            )}
            <div className="w-full">
                <label>Search</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" onChange={onChangeHandler} />
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
                                <th className="whitespace-nowrap px-4 py-2">N.</th>
                                <th className="whitespace-nowrap px-4 py-2">Pokemon</th>
                                <th className="whitespace-nowrap px-4 py-2">Type</th>
                                <th className="whitespace-nowrap px-4 py-2">Base Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map((pokemon: Pokemon) => (
                                <tr key={pokemon.id} onClick={() => handlePokemonClick(pokemon)}>
                                    <td className="whitespace-nowrap px-4 py-2">{String(pokemon.id).padStart(3, '0')}</td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <div className="flex items-center">
                                            <PokemonImg pokemonId={pokemon.id} />
                                            <div className="pl-4">{pokemon.name}</div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2">{pokemon.types.join(',')}</td>
                                    <td>
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex justify-between">
                                                <div>HP: {pokemon.baseHp}</div>
                                                <div>Atk: {pokemon.baseAttack}</div>
                                                <div>Def: {pokemon.baseDefense}</div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>Sp Atk {pokemon.baseSpAttack}</div>
                                                <div>Sp Def {pokemon.baseSpDefense}</div>
                                                <div>Speed {pokemon.baseSpeed}</div>
                                            </div>
                                        </div>
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


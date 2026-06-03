import { useGraphQL } from '../hooks/useGraphQL';
import { useEffect, useState } from 'react';
import { type Pokemon } from '../types/pokemon';
import PokemonImg from '../components/PokemonImg';

const Pokedex = () => {
    const { data, error, loading, executeQuery } = useGraphQL();
    const [search, setSearch] = useState<string | null>(null);
    let pokemonList = [];

    const queryAll = `
    query {
        getGlobalPokedex {
            id
            name
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
            types
            baseHp
            baseAttack
            baseDefense
            baseSpAttack
            baseSpDefense
            baseSpeed
        }
    }`

    useEffect(() => {
        executeQuery(queryAll);
    }, [executeQuery]);

    useEffect(() => {
        if (!search) return;
        executeQuery(querySearch, { search });
    }, [search, executeQuery]);

    if (data && data.getGlobalPokedex) {
        pokemonList = data.getGlobalPokedex;
    }

    if (data && data.getPokemonByName) {
        pokemonList = data.getPokemonByName;
    }

    console.log(data);

    const onChangeHandler = (e) => {
        const currentSearch = e.currentTarget.value;
        if (currentSearch == search) return;
        setSearch(currentSearch);
    }

    return (
        <div className="w-full mx-auto p-8">
            <div>PokeDex</div>
            <div className="w-full max-w-xl">
                <label>Search</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" onChange={onChangeHandler} />
            </div>
            <div className="w-full">
                <table className="w-full table-auto">
                    <thead className="bg-slate-900 text-left">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2">N.</th>
                            <th className="whitespace-nowrap px-4 py-2">Pokemon</th>
                            <th className="whitespace-nowrap px-4 py-2">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokemonList.map((pokemon: Pokemon) => (
                            <tr key={pokemon.id}>
                                <td className="whitespace-nowrap px-4 py-2">{pokemon.id}</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <div className="flex items-center">
                                        <PokemonImg pokemonId={pokemon.id} />
                                        <div className="pl-4">{pokemon.name}</div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2">{pokemon.types.join(',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pokedex;


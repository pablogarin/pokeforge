import { useState, useEffect } from 'react';
import ActivePokemon from '../components/ActivePokemon';
import PokeBall from '../components/PokeBall';
import Dialog from '../components/Dialog';
import PokemonForm from '../components/PokemonForm';
import CurrentPokemon from '../components/CurrentPokemon';
import { useGraphQL, queryMoves } from '../hooks/useGraphQL';
import { type UserPokemon, type Pokemon } from '../types/pokemon';
import './Lineup.css';

const queryGetMyCollection = `
query {
  getMyCollection {
    customNickname
    level
    gender
    nature
    isInRooster
    currentHp
    currentAttack
    currentDefense
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
      speciesId
    }
  }
}`;

type Response = {
    getMyCollection: UserPokemon[];
}

const extractLineupFromData = (data: Response) => {
    if (!data) return [];
    if (data.getMyCollection !== undefined) return data.getMyCollection;
    return [];
}

const Lineup = () => {
    const { data, error, loading, executeQuery } = useGraphQL();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [pokemonList, setPokemonList] = useState<(UserPokemon | null)[]>([]);

    useEffect(() => {
        executeQuery(queryGetMyCollection);
    }, [executeQuery]);

    const fillPokemonList = (newList: UserPokemon[]) => {
        const finalList = Array(6).fill(null);
        for (const i in newList) {
            finalList[i] = newList[i];
        }
        setPokemonList(finalList);
    }

    useEffect(() => {
        const lineup = extractLineupFromData(data);
        fillPokemonList(lineup);
    }, [data]);

    const onSave = (newPokemon?: UserPokemon) => {
        if (newPokemon) fillPokemonList([...pokemonList.filter(pk => !!pk), newPokemon]);
        setShowForm(false);
    }

    if (!loading && (!pokemonList[0] || showForm)) {
        return (<PokemonForm saveCallback={onSave} />);
    }

    const handleAddBtnClick = () => {
        setShowForm(true);
    }

    return (
        <div className="lineup w-1/2 h-full min-w-[600px] mx-auto rounded-md">
            <div className="flex flex-col relative h-full p-[12px] z-10">
                <div className="flex flex-1">
                    {pokemonList.length > 0 && !!pokemonList[0] && (
                        <>
                            <div className="flex flex-1">
                                <CurrentPokemon pokemon={pokemonList[0]} />
                            </div>
                            <div className="pokemon-lineup flex flex-1 flex-col">
                                {pokemonList.slice(1).map((pokemon: UserPokemon | null) => (
                                    !!pokemon ? (<ActivePokemon pokemon={pokemon} />) : (<div className="pokemon-lineup__empty-slot"></div>)
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-end w-full">
                    <div className="flex flex-1 justify-start items-center bg-white border-4 border-black text-black h-[60px] px-8">Choose a POKeMON</div>
                    <div className="flex w-[140px] ml-2">
                        <PokeBall text="ADD" onClick={handleAddBtnClick} />
                    </div>
                    {error && (<Dialog title="Error" body={error} hasMore={false} />)}
                </div>
            </div>
        </div>
    );
}


export default Lineup;

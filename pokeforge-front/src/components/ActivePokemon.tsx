import './ActivePokemon.css'
import './CurrentPokemon.css'

import PokeBall from './PokeBall';
import PokemonImg from './PokemonImg';
import { type UserPokemon } from '../types/pokemon';
import { Mars, Venus } from 'lucide-react';

type ActivePokemonProps = {
    pokemon: UserPokemon;
}

const ActivePokemon = ({ pokemon }: ActivePokemonProps) => {
    const getGenderSymbol = (gender: string) => {
        if (gender == 'Male') {
            return (<Mars className="[filter:drop-shadow(2px_2px_0px_#1e3a8a)]" size={24} color="#40C8F8" strokeWidth={4} />)
        }
        if (gender == 'Female') {
            return (<Venus className="[filter:drop-shadow(2px_2px_0px_#1e3a8a)]" size={24} color="#F89890" strokeWidth={4} />)
        }
    }
    return (
        <div className="pokemon-tile__container flex items-center w-full h-[60px] my-2 relative">
            <div className="flex absolute top-0 left-[-24px]">
                <div className="absolute z-50 top-[15px] left-[20px]">
                    <PokemonImg pokemonId={pokemon.pokemonReference.speciesId} height="50" width="50" />
                </div>
                <PokeBall />
            </div>
            <div className="pokemon-tile flex flex-1 h-full w-full items-center justify-start pl-[40px]">
                <div className="flex flex-col justify-between items-center">
                    <div className="flex">{pokemon.customNickname ? pokemon.customNickname : pokemon.pokemonReference.name}</div>
                    <div className="flex">Lv{pokemon.level}</div>
                </div>
                <div className="flex">{getGenderSymbol(pokemon.gender)}</div>
            </div>
        </div>
    );
}


export default ActivePokemon;

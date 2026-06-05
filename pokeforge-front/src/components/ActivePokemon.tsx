import './ActivePokemon.css'
import './CurrentPokemon.css'

import PokeBall from './PokeBall';
import PokemonImg from './PokemonImg';
import { type UserPokemon } from '../types/pokemon';

type ActivePokemonProps = {
    pokemon: UserPokemon;
}

const ActivePokemon = ({ pokemon }: ActivePokemonProps) => {
    return (
        <div className="pokemon-tile__container flex items-center w-full h-[60px] my-2 relative">
            <div className="flex absolute top-0 left-[-24px]">
                <div className="absolute z-50 top-[15px] left-[20px]">
                    <PokemonImg pokemonId={pokemon.pokemonId} height="50" width="50" />
                </div>
                <PokeBall />
            </div>
            <div className="pokemon-tile flex flex-1 h-full w-full items-center justify-start pl-[40px]">
                <div className="flex flex-col justify-between items-center">
                    <div className="flex">{pokemon.customNickname}</div>
                    <div className="flex">Lv{pokemon.level}</div>
                </div>
                <div className="flex">{pokemon.gender}</div>
            </div>
        </div>
    );
}


export default ActivePokemon;

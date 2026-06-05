import './CurrentPokemon.css';

import PokeBall from './PokeBall';
import PokemonImg from './PokemonImg';
import { type UserPokemon } from '../types/pokemon';

const CurrentPokemon = (pokemon: UserPokemon) => {
    return (
        <div className="pokemon-tile__container flex justify-center items-center ml-4 mr-12 mt-20 w-full h-1/3 relative">
            <div className="absolute [top:-20px] [left:-22px]">
                <PokeBall />
                <div className="absolute w-[100px] h-[100px] top-[30px] left-[10px] z-50">
                    <PokemonImg pokemonId={pokemon.pokemonId} height="100" width="100" />
                </div>
            </div>
            <div className="pokemon-tile flex flex-col justify-center items-center h-full w-full pl-8">
                <div>{pokemon.customNickname}</div>
                <div>Lv{pokemon.level}</div>
            </div>
        </div>
    );
}

export default CurrentPokemon;

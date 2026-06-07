import './CurrentPokemon.css';

import PokeBall from './PokeBall';
import PokemonImg from './PokemonImg';
import { type UserPokemon } from '../types/pokemon';

type CurrentPokemonProps = {
    pokemon: UserPokemon;
}

const CurrentPokemon = ({ pokemon }: CurrentPokemonProps) => {
    return (
        <div className="pokemon-tile__container flex justify-center items-center ml-4 mr-12 mt-20 w-full h-1/3 relative">
            <div className="absolute [top:-20px] [left:-22px]">
                <PokeBall />
                <div className="absolute w-[120px] h-[120px] top-[10px] left-[-20px] z-50">
                    <PokemonImg pokemonId={pokemon.pokemonReference.speciesId} height="120" width="120" isIcon={true} />
                </div>
            </div>
            <div className="pokemon-tile flex flex-col justify-center items-center h-full w-full pl-8">
                <div>{pokemon.customNickname ? pokemon.customNickname : pokemon.pokemonReference.name}</div>
                <div>Lv{pokemon.level}</div>
            </div>
        </div>
    );
}

export default CurrentPokemon;

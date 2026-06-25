import './ActivePokemon.css'
import './CurrentPokemon.css'

import { useNavigate } from 'react-router';
import GenderIcon from './GenderIcon';
import PokeBall from './PokeBall';
import PokemonImg from './PokemonImg';
import { type UserPokemon } from '../types/pokemon';
import { Mars, Venus } from 'lucide-react';

type ActivePokemonProps = {
    pokemon: UserPokemon;
}

const ActivePokemon = ({ pokemon }: ActivePokemonProps) => {
    const navigate = useNavigate();
    const getGenderSymbol = (gender: 'Male' | 'Female') => {
        return (
            <GenderIcon gender={gender} />
        );
    }

    const goToPokemonDetails = () => {
        navigate(`/pokemon/${pokemon.id}`);
    }

    return (
        <div className="pokemon-tile__container flex items-center w-full h-[60px] my-2 relative" onClick={() => goToPokemonDetails()}>
            <div className="flex absolute top-0 left-[-24px]">
                <div className="absolute z-50 top-[-5px] left-[-15px] w-[100px]">
                    <PokemonImg pokemonId={pokemon.pokemonReference.speciesId} height="100" width="100" isIcon={true} />
                </div>
                <PokeBall />
            </div>
            <div className="pokemon-tile flex flex-1 h-full w-full items-center justify-start pl-[40px]">
                <div className="flex flex-col w-[50%] justify-between items-center">
                    <div className="flex">{pokemon.customNickname ? pokemon.customNickname : pokemon.pokemonReference.name}</div>
                    <div className="flex">Lv{pokemon.level}</div>
                </div>
                <div className="h-full flex items-end">{getGenderSymbol(pokemon.gender)}</div>
                <div className="h-full flex items-center"></div>
            </div>
        </div>
    );
}


export default ActivePokemon;

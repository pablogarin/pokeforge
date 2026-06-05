import { useState } from 'react';
import { type Pokemon } from '../types/pokemon';
import PokemonImg from './PokemonImg';
import './PokemonForm.css';

const PokemonForm = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    return (
        <div className="pokemon-form">
            <h2 className="pokemon-form__header">ADD POKeMON</h2>
            <div className="pokemon-form__body">
                <div className="pokemon-form__pokemon-box">
                    <div className="flex pl-6 justify-center items-center">
                        {!pokemon && (
                            <div className="pokemon-form__pokemon-box__shadow"></div>
                        )}
                        {!!pokemon && (<PokemonImg pokemonId={1} width="100" height="100" />)}
                    </div>
                    <div className="flex flex-col justify-center items-start text-[#333]">
                        <div>POKeMON?</div>
                        <div>_ _ _ _ _ __</div>
                    </div>
                </div>
                <div className="pokemon-form__input-container">
                    <label htmlFor="pokemon">POKEMON:</label>
                    <input className="pokemon-form__input" name="pokemon" type="text" placeholder="Search for your pokemon" />
                </div>
                {!!pokemon && (
                    <>
                        <div className="flex">
                            <label htmlFor="nickname"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="nickname" type="text" placeholder="Nickname" />
                        </div>
                        <div className="flex">
                            <label htmlFor="level"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="level" type="text" placeholder="Level" />
                        </div>
                        <div className="flex">
                            <label htmlFor="gender"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="gender" type="text" placeholder="Gender" />
                        </div>
                        <div className="flex">
                            <label htmlFor="nature"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="nature" type="text" placeholder="Nature" />
                        </div>
                        <div className="flex">
                            <label htmlFor="hp"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="hp" type="text" placeholder="HP" />
                        </div>
                        <div className="flex">
                            <label htmlFor="attack"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="attack" type="text" placeholder="Attack" />
                        </div>
                        <div className="flex">
                            <label htmlFor="defense"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="defense" type="text" placeholder="Defense" />
                        </div>
                        <div className="flex">
                            <label htmlFor="spattack"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="spattack" type="text" placeholder="Sp Attack" />
                        </div>
                        <div className="flex">
                            <label htmlFor="spdefense"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="spdefense" type="text" placeholder="Sp Defense" />
                        </div>
                        <div className="flex">
                            <label htmlFor="speed"></label>
                            <input className="text-[#333] w-full py-2 px-4 rounded-sm border-1 border-[#333]" name="speed" type="text" placeholder="Speed" />
                        </div>
                    </>
                )}
            </div>
            <div className="pokemon-form__footer">
                <button className="border-2 bg-[#E0D858] rounded-[3px] px-4 py-2 [text-shadow:1px_1px_0px_#B8A020,1px_-1px_0px_#B8A020,-1px_1px_0px_#B8A020,-1px_-1px_0px_#B8A020]">SAVE</button>
            </div>
        </div>
    );
}

export default PokemonForm;

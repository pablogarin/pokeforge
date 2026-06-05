import { useState } from 'react';
import { type Pokemon } from '../types/pokemon';
import PokemonImg from './PokemonImg';
import './PokemonForm.css';

const PokemonForm = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    return (
        <div className="pokemon-form">
            <h2 className="pokemon-form__header"><span className="font-bold relative top-[-2px] left-[-3px]">&#x271A;</span><span>ADD POKeMON</span></h2>
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
                    <div className="pokemon-form__input-dropdown">
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                        <div className="pokemon-form__input-dropdown__item">Pikachu</div>
                    </div>
                </div>
                {!!pokemon && (
                    <>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="nickname">NICKNAME:</label>
                            <input className="pokemon-form__input" name="nickname" type="text" placeholder="Nickname" />
                        </div>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="level">LEVEL:</label>
                            <input className="pokemon-form__input" name="level" type="text" placeholder="Level" />
                        </div>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="gender">GENDER:</label>
                            <input className="pokemon-form__input" name="gender" type="text" placeholder="Gender" />
                        </div>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="nature">NATURE:</label>
                            <input className="pokemon-form__input" name="nature" type="text" placeholder="Nature" />
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="hp">HP:</label>
                                <input className="pokemon-form__input" name="hp" type="text" placeholder="HP" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="attack">ATTACK:</label>
                                <input className="pokemon-form__input" name="attack" type="text" placeholder="Attack" />
                            </div>
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="defense">DEFENSE:</label>
                                <input className="pokemon-form__input" name="defense" type="text" placeholder="Defense" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="spatk">SP ATK:</label>
                                <input className="pokemon-form__input" name="spatk" type="text" placeholder="Sp Attack" />
                            </div>
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="spdef">SP DEF:</label>
                                <input className="pokemon-form__input" name="spdef" type="text" placeholder="Sp Defense" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="speed">SPEED:</label>
                                <input className="pokemon-form__input" name="speed" type="text" placeholder="Speed" />
                            </div>
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

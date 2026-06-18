import { useState, useEffect } from 'react';
import { z } from 'zod';
import { type Move, type Pokemon, type UserPokemon, UserPokemonSchema } from '../types/pokemon';
import PokemonImg from './PokemonImg';
import { Loader2 } from 'lucide-react';
import InputField from './Form/InputField';
import RadioField from './Form/RadioField';
import SelectField, { type SelectFieldOption } from './Form/SelectField';
import Dialog from './Dialog';
import './PokemonForm.css';
import { useGraphQL, queryAll, queryMoves, upsertQuery } from '../hooks/useGraphQL';

type PokemonFormProps = {
    saveCallback: any;
}

type InputErrorMessage = {
    level: string;
    nature: string;
    currentHp: string;
    currentAttack: string;
    currentDefense: string;
    currentSpAttack: string;
    currentSpDefense: string;
    currentSpeed: string;
}

const PokemonForm = ({ saveCallback }: PokemonFormProps) => {
    const { data, error, loading, executeQuery } = useGraphQL<Pokemon[] | Move[]>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [userPokemon, setUserPokemon] = useState<UserPokemon>(null);
    const [moves, setMoves] = useState<SelectFieldOption<Move>[]>([]);
    const [selectedMoves, setSelectedMoves] = useState<SelectFieldOption<Move>[]>([]);
    const [animateNickname, setAnimateNickname] = useState<boolean>(false);
    const [pokemonList, setPokemonList] = useState<SelectFieldOption<Pokemon>[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<{ title: string, body: string }>();
    const [inputErrors, setInputErrors] = useState<InputErrorMessage>({} as InputErrorMessage);

    useEffect(() => {
        executeQuery(queryAll);
    }, [executeQuery]);

    useEffect(() => {
        if (!!error) {
            setDialogData({ title: "Error", body: error });
            setShowDialog(true);
        }
    }, [error]);

    useEffect(() => {
        if (!data) return;
        const { type, data: response } = data;
        if (type == 'Pokemon[]') {
            const optionsList = (response as Pokemon[]).map((pokemon: Pokemon) => {
                return {
                    text: `${pokemon.id.toString().padStart(3, '0')} - ${pokemon.name}`,
                    value: pokemon
                }
            });
            setPokemonList(optionsList);
        }
        if (type == 'Move[]') {
            const globalMoves = (response as Move[]).map((move: Move) => ({ text: move.name, value: move }));
            setMoves(globalMoves);
        }
    }, [data]);

    const pokemonSelection = (pokemon: Pokemon) => {
        setPokemon(pokemon);
        // Start object with default values already set
        setUserPokemon(pkmn => ({ ...pkmn, pokemonId: pokemon.id, pokemonReference: pokemon, gender: 'Male' }))
        executeQuery(queryMoves);
    }

    const onInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name;
        const val = e.target.value.trim();
        const inputType = e.target.type;
        if (inputType == "number") {
            if (
                !e.target.validity.valid ||
                Number(val) == userPokemon[key]
            ) return;
            setUserPokemon(pkmn => ({ ...pkmn, [key]: Number(val) }));
        } else {
            if (key == "customNickname") {
                if (val.length > 10) {
                    e.preventDefault();
                    return;
                }
            }
            setUserPokemon(pkmn => ({ ...pkmn, [key]: val }));
        }
        // if (!val) return;
        // if (val == userPokemon[key]) return;
    }

    const onSaveHandler = async () => {
        if (!pokemon) {
            setDialogData({
                title: "Eeerrhm...",
                body: "You must choose a pokemon first. You can scroll though the list or start writting it's name"
            });
            setShowDialog(true);
            return;
        }
        const moves = selectedMoves.map((opt: SelectFieldOption<Move>) => opt.value.id);
        const result = UserPokemonSchema.safeParse({ ...userPokemon, userId: 1, isInRooster: false, knownMoveIds: moves });
        if (!result.success) {
            const errors = Object.entries(z.flattenError(result.error).fieldErrors).reduce((acc, [field, err]) => {
                acc[field] = err.pop();
                return acc;
            }, {} as InputErrorMessage);
            // const errors = result.error?.map(errori => 
            setInputErrors({ ...errors });
            setDialogData({ title: "Saving... NOT!", body: Object.entries(errors).map(([k, v]) => v).join(', ') });
            setShowDialog(true);
            return;
        }
        const { pokemonReference, ...payload } = { ...result.data };
        await executeQuery(upsertQuery, { input: payload });
        saveCallback({ ...payload, pokemonReference });
    }

    const toggleNicknameAnimation = (isFocused: boolean) => {
        setAnimateNickname(isFocused);
    }

    const onCancelHandler = () => {
        saveCallback();
    }

    const getCursorPosition = () => {
        if (userPokemon === undefined) return '0px';
        if (userPokemon.customNickname === undefined) return '0px';
        return `${(userPokemon.customNickname.length < 9 ? userPokemon.customNickname.length : 9) * 14}px`;
    }

    const addMove = (move: Move) => {
        if (selectedMoves.some(opt => opt.value.id === move.id)) {
            // remove from list
            setSelectedMoves([...selectedMoves.filter(e => e.value.id != move.id)]);
        } else {
            // max 4 moves.
            if (selectedMoves.length == 4) return;
            const opt = {
                text: move.name,
                value: move
            }
            setSelectedMoves(old => [...old, opt]);
        }
    }

    // { value: string, label: string, isDefault?: boolean }
    const genders = [
        {
            label: 'MALE',
            value: 'Male',
            isDefault: true,
        },
        {
            label: 'FEMALE',
            value: 'Female',
        }
    ];

    if (loading) return (
        <div className="flex justify-center items-center w-full h-full">
            <Loader2 className="animate-spin" size={64} />
        </div>
    );

    return (
        <>
            <div className="pokemon-form relative">
                <h2 className="pokemon-form__header"><span className="font-bold relative top-[-2px] left-[-3px]">&#x271A;</span><span>ADD POKeMON</span></h2>
                <div className="pokemon-form__body">
                    <div className="pokemon-form__pokemon-box">
                        <div className="flex pl-6 justify-center items-center">
                            {!pokemon && (
                                <div className="pokemon-form__pokemon-box__shadow"></div>
                            )}
                            {!!pokemon && (<PokemonImg pokemonId={pokemon.id} width="100" height="100" />)}
                        </div>
                        <div className="flex flex-col justify-center items-start text-[#333]">
                            <div>{!!pokemon ? pokemon.name.toUpperCase() : 'POKeMON?'}</div>
                            {userPokemon && (
                                <div
                                    style={{ "--chars": getCursorPosition(), "--is-focused": animateNickname ? 'block' : 'none', } as React.CSSProperties}
                                    className="pokemon-form__nickname"
                                >
                                    {userPokemon?.customNickname ? userPokemon.customNickname : '          '}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pixel-rounded f-fill h-[20px]"></div>
                    {!pokemon && (
                        <SelectField<Pokemon> name="pokemon" label="POKEMON" placeholder="Search by name" data={pokemonList} onOptionSelect={pokemonSelection} />
                    )}
                    {!!pokemon && (
                        <>
                            <InputField onChange={onInputFieldChange} onFocus={() => toggleNicknameAnimation(true)} onBlur={() => toggleNicknameAnimation(false)} label="NICKNAME" maxLength={10} name="customNickname" type="text" placeholder="Nickname" />
                            <InputField onChange={onInputFieldChange} label="LEVEL" type="number" name="level" placeholder="Level" error={inputErrors.level} />
                            <InputField onChange={onInputFieldChange} label="NATURE" type="text" name="nature" placeholder="Nature" error={inputErrors.nature} />
                            <RadioField onChange={onInputFieldChange} name="gender" options={genders} />
                            <div className="flex gap-[6px]">
                                <InputField onChange={onInputFieldChange} label="HP" type="number" name="currentHp" placeholder="HP" error={inputErrors.currentHp} />
                                <InputField onChange={onInputFieldChange} label="ATTACK" type="number" name="currentAttack" placeholder="Attack" error={inputErrors.currentAttack} />
                            </div>
                            <div className="flex gap-[6px]">
                                <InputField onChange={onInputFieldChange} label="DEFENSE" type="number" name="currentDefense" placeholder="Defense" error={inputErrors.currentDefense} />
                                <InputField onChange={onInputFieldChange} label="SP ATK" type="number" name="currentSpAttack" placeholder="Sp. Attack" error={inputErrors.currentSpAttack} />
                            </div>
                            <div className="flex gap-[6px]">
                                <InputField onChange={onInputFieldChange} label="SP DEF" type="number" name="currentSpDefense" placeholder="Sp. Defense" error={inputErrors.currentSpDefense} />
                                <InputField onChange={onInputFieldChange} label="SPEED" type="number" name="currentSpeed" placeholder="Speed" error={inputErrors.currentSpeed} />
                            </div>
                            <SelectField<Move> className="upwards" name="move" multi={selectedMoves} label="MOVES" placeholder="Select Moves" data={moves} onOptionSelect={addMove} />
                        </>
                    )}
                </div>
                <div className="pokemon-form__footer gap-x-[4px]">
                    <button className="pokemon-form__button" onClick={onCancelHandler}>CANCEL</button>
                    <button className="pokemon-form__button" onClick={onSaveHandler}>SAVE</button>
                </div>
            </div >
            {showDialog && (<Dialog {...dialogData} dismiss={() => setShowDialog(false)} lines={3} />)}
        </>
    );
}

export default PokemonForm;

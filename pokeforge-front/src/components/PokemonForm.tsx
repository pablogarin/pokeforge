import { useState, useEffect } from 'react';
import { type Pokemon, type UserPokemon, UserPokemonSchema } from '../types/pokemon';
import PokemonImg from './PokemonImg';
import { Loader2 } from 'lucide-react';
import InputField from './Form/InputField';
import RadioField from './Form/RadioField';
import SelectField from './Form/SelectField';
import './PokemonForm.css';
import { useGraphQL } from '../hooks/useGraphQL';

type Response = {
    getGlobalPokedex: Pokemon[] | undefined;
    getPokemonByName: Pokemon[] | undefined;
}

const querySearch = `
query SearchPokemon($search: String!) {
    getPokemonByName(query: $search) {
        id
        name
        height
        weight
        speciesId
        genus
        flavorText
        types
        baseHp
        baseAttack
        baseDefense
        baseSpAttack
        baseSpDefense
        baseSpeed
    }
}`

const upsertQuery = `
    mutation ($input: UpsertPokemonInput!) {
        upsertPokemon(input: $input) {
            id
            customNickname
            ivRangeAttack
            ivRangeSpeed
            knownMoves {
                name
                type
            }
            pokemonReference {
                name
                baseSpeed
            }
        }
    }
`

const queryAll = `
query {
    getGlobalPokedex {
        id
        name
        height
        weight
        speciesId
        genus
        flavorText
        types
        baseHp
        baseAttack
        baseDefense
        baseSpAttack
        baseSpDefense
        baseSpeed
    }
}`;

type PokemonFormProps = {
    saveCallback: any;
}

const PokemonForm = ({ saveCallback }: PokemonFormProps) => {
    const { data, error, loading, executeQuery } = useGraphQL();
    const [query, setQuery] = useState<string>('');
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [userPokemon, setUserPokemon] = useState<UserPokemon>(null);
    const [animateNickname, setAnimateNickname] = useState<boolean>(false);
    const [pokemonList, setPokemonList] = useState<{ text: string, value: Pokemon }[]>([]);

    useEffect(() => {
        executeQuery(queryAll);
    }, [executeQuery]);

    useEffect(() => {
        const optionsList = data?.getGlobalPokedex?.map((pokemon: Pokemon) => {
            return {
                text: pokemon.name,
                value: pokemon
            }
        });
        setPokemonList(optionsList);
    }, [data]);

    const pokemonSelection = (pokemon: Pokemon) => {
        setPokemon(pokemon);
        setUserPokemon(pkmn => ({ ...pkmn, pokemonId: pokemon.id, pokemonReference: pokemon }))
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
        const result = UserPokemonSchema.safeParse({ ...userPokemon, userId: 1, isInRooster: false });
        if (!result.success) {
            console.error(result.error?.format())
            return;
        }
        const { pokemonReference, ...payload } = { ...result.data, knownMoveIds: [] };
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

    return (
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
                    <SelectField<Pokemon> name="pokemon" label="POKEMON" data={pokemonList} onOptionSelect={pokemonSelection} />
                )}
                {!!pokemon && (
                    <>
                        <InputField onChange={onInputFieldChange} onFocus={() => toggleNicknameAnimation(true)} onBlur={() => toggleNicknameAnimation(false)} label="NICKNAME" maxLength={10} name="customNickname" type="text" placeholder="Nickname" />
                        <InputField onChange={onInputFieldChange} label="LEVEL" type="number" name="level" placeholder="Level" />
                        <InputField onChange={onInputFieldChange} label="NATURE" type="text" name="nature" placeholder="Nature" />
                        <RadioField onChange={onInputFieldChange} name="gender" options={genders} />
                        <div className="flex gap-[6px]">
                            <InputField onChange={onInputFieldChange} label="HP" type="number" name="currentHp" placeholder="HP" />
                            <InputField onChange={onInputFieldChange} label="ATTACK" type="number" name="currentAttack" placeholder="Attack" />
                        </div>
                        <div className="flex gap-[6px]">
                            <InputField onChange={onInputFieldChange} label="DEFENSE" type="number" name="currentDefense" placeholder="Defense" />
                            <InputField onChange={onInputFieldChange} label="SP ATK" type="number" name="currentSpAttack" placeholder="Sp. Attack" />
                        </div>
                        <div className="flex gap-[6px]">
                            <InputField onChange={onInputFieldChange} label="SP DEF" type="number" name="currentSpDefense" placeholder="Sp. Defense" />
                            <InputField onChange={onInputFieldChange} label="SPEED" type="number" name="currentSpeed" placeholder="Speed" />
                        </div>
                    </>
                )}
            </div>
            <div className="pokemon-form__footer gap-x-[4px]">
                <button className="pokemon-form__button" onClick={onCancelHandler}>CANCEL</button>
                <button className="pokemon-form__button" onClick={onSaveHandler}>SAVE</button>
            </div>
        </div >
    );
}

export default PokemonForm;

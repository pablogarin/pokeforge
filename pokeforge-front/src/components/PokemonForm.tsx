import { useState, useEffect } from 'react';
import { type Pokemon, type UserPokemon, UserPokemonSchema } from '../types/pokemon';
import PokemonImg from './PokemonImg';
import { Loader2 } from 'lucide-react';
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

type PokemonFormProps = {
    saveCallback: any;
}

const PokemonForm = ({ saveCallback }: PokemonFormProps) => {
    const { data, error, loading, executeQuery } = useGraphQL();
    const [query, setQuery] = useState<string>('');
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [userPokemon, setUserPokemon] = useState<UserPokemon>(null);

    useEffect(() => {
        if (query) {
            executeQuery(querySearch, { search: query });
        }
    }, [executeQuery, query]);

    const searchInputChange = (e) => {
        const val = e.target.value;
        if (val == query) return;
        setQuery(val);
    }

    const pokemonSelection = (pokemon: Pokemon) => {
        setPokemon(pokemon);
        setUserPokemon(pkmn => ({ ...pkmn, pokemonId: pokemon.id, pokemonReference: pokemon }))
    }

    const onInputFieldChange = (e) => {
        const key = e?.target?.name;
        const val = e?.target?.value || '';
        const inputType = e?.target?.type;
        if (inputType == "number") {
            if (Number(val) == userPokemon[key] || isNaN(val)) return;
            setUserPokemon(pkmn => ({ ...pkmn, [key]: Number(val) }));
        } else {
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

    const onCancelHandler = () => {
        saveCallback();
    }

    return (
        <div className="pokemon-form">
            {loading && (<Loader2 />)}
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
                        <div>{userPokemon?.customNickname ? userPokemon.customNickname : '_______'}</div>
                    </div>
                </div>
                {!pokemon && (
                    <div className="pokemon-form__input-container">
                        <label htmlFor="pokemon">POKEMON:</label>
                        <input className="pokemon-form__input" name="pokemon" type="text" onChange={searchInputChange} placeholder="Search for your pokemon" />
                        {!!query.length && !!data && (
                            <div className="pokemon-form__input-dropdown">
                                {data?.getPokemonByName?.map((pokemon: Pokemon) => (
                                    <div className="pokemon-form__input-dropdown__item" onClick={() => pokemonSelection(pokemon)}>{pokemon.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {!!pokemon && (
                    <>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="customNickname">NICKNAME:</label>
                            <input className="pokemon-form__input" onChange={onInputFieldChange} name="customNickname" type="text" placeholder="Nickname" />
                        </div>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="level">LEVEL:</label>
                            <input className="pokemon-form__input" onChange={onInputFieldChange} name="level" type="number" placeholder="Level" />
                        </div>
                        <div className="pokemon-form__input-container">
                            <label htmlFor="nature">NATURE:</label>
                            <input className="pokemon-form__input" onChange={onInputFieldChange} name="nature" type="text" placeholder="Nature" />
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__radio-container">
                                <label>
                                    <input className="pokemon-form__radio" value="Male" onChange={onInputFieldChange} name="gender" id="gender-male" type="radio" />
                                    <span>MALE</span>
                                </label>
                                <label>
                                    <input className="pokemon-form__radio" value="Female" onChange={onInputFieldChange} name="gender" id="gender-female" type="radio" />
                                    <span>FEMALE</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentHp">HP:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentHp" type="number" placeholder="HP" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentAttack">ATTACK:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentAttack" type="number" placeholder="Attack" />
                            </div>
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentDefense">DEFENSE:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentDefense" type="number" placeholder="Defense" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentSpAttack">SP ATK:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentSpAttack" type="number" placeholder="Sp Attack" />
                            </div>
                        </div>
                        <div className="flex gap-[6px]">
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentSpDefense">SP DEF:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentSpDefense" type="number" placeholder="Sp Defense" />
                            </div>
                            <div className="pokemon-form__input-container">
                                <label htmlFor="currentSpeed">SPEED:</label>
                                <input className="pokemon-form__input" onChange={onInputFieldChange} name="currentSpeed" type="number" placeholder="Speed" />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="pokemon-form__footer gap-x-[4px]">
                <button className="pokemon-form__button" onClick={onCancelHandler}>CANCEL</button>
                <button className="pokemon-form__button" onClick={onSaveHandler}>SAVE</button>
            </div>
        </div>
    );
}

export default PokemonForm;

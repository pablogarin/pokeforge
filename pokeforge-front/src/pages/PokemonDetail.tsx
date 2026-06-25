import React from 'react';
import './PokemonDetail.css';

import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { queryFetchUserPokemon, useGraphQL } from '../hooks/useGraphQL';
import { type UserPokemon, type Pokemon } from '../types/pokemon';
import PokemonImg from '../components/PokemonImg';
import GenderIcon from '../components/GenderIcon';
import ElementTypes from '../components/ElementTypes';

const convertHeight = (height: number) => {
    const imperial = Number((height * 328) / 1000).toFixed(2);
    const feet = imperial.split('.')[0];
    const inches = imperial.split('.')[1][0];
    return `${feet}'${inches}"`;
}

const convertWeight = (weight: number) => {
    return Number((weight / 10) * 2.2).toFixed(1) + ' lbs.';
}

type TabData = {
    tabId: number;
    tabFields: { label: string, value: string | number | React.ReactElement }[];
}

const PokemonDetail = () => {
    const { data, error, loading, executeQuery } = useGraphQL<UserPokemon>();
    const [pokemon, setPokemon] = useState<UserPokemon>(null);
    const [tabData, setTabData] = useState<TabData[]>(null);
    const { id: pokemonId } = useParams();
    const tabs = [
        { id: 1, name: "pokemon" },
        { id: 2, name: "stats" },
        { id: 3, name: "moves" },
    ];
    const [activeTab, setActiveTab] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        executeQuery(queryFetchUserPokemon, { pokemonId: parseInt(pokemonId) });
    }, [pokemonId, executeQuery]);

    useEffect(() => {
        if (!!data) {
            setPokemon(data.data);
            setTabData([
                {
                    tabId: 1, tabFields: [
                        { label: "No", value: data.data.pokemonReference.speciesId.toString().padStart(3, '0') },
                        { label: "NAME", value: data.data.pokemonReference.name },
                        { label: "TYPE", value: (<ElementTypes types={data.data.pokemonReference.types} />) },
                        { label: "HT", value: data.data.pokemonReference.height },
                        { label: "WT", value: data.data.pokemonReference.weight },
                        { label: "NAT", value: data.data.nature },
                    ]
                },
                {
                    tabId: 2, tabFields: [
                        { label: "HP", value: data.data.currentHp },
                        { label: "ATK", value: data.data.currentAttack },
                        { label: "DEF", value: data.data.currentDefense },
                        { label: "SP.ATK", value: data.data.currentSpAttack },
                        { label: "SP.DEF", value: data.data.currentSpDefense },
                        { label: "SPEED", value: data.data.currentSpeed },
                    ]
                },
                { tabId: 3, tabFields: data.data.knownMoves.map((move) => ({ label: "MV", value: `${move.name}` })) },
            ])
        }
    }, [data]);

    if (!pokemon) {
        return (<div>Loading</div>);
    }
    return (
        <div className="pokemon-detail flex flex-col w-full">
            { /* tab panel */}
            <div className="tab-panel menu-header flex justify-between items-center w-full">
                <div className="tab-panel__title">
                    POKEMON INFO
                </div>
                <div className="tab-panel__tabs flex">
                    {tabs.map(tab => (
                        <div className={`tab-panel__tabs__item ${activeTab == tab.id ? 'active' : ''}`} data-name={tab.name} onClick={() => setActiveTab(tab.id)}></div>))}
                </div>
                <div className="tab-panel__actions">
                    <button className="tab-panel__action-btn" onClick={() => navigate("/")}>CANCEL</button>
                </div>
            </div>
            { /* main view */}
            <div className="pokemon-detail__details">
                <div className="pokemon-detail__card">
                    <div className="pokemon-detail__card__title">
                        <span>Lv{pokemon.level}</span>
                        <span>{pokemon.customNickname ? pokemon.customNickname : pokemon.pokemonReference.name}</span>
                        <span><GenderIcon gender={pokemon.gender} /></span>
                    </div>
                    <div className="pokemon-detail__card__picture">
                        <PokemonImg pokemonId={pokemon.pokemonReference.id} height="150" width="150" />
                    </div>
                </div>
                <div className="pokemon-detail__body">
                    <div className="pokemon-detail__body-spacer"></div>
                    <div className="pokemon-detail__info">
                        {tabData.find(e => e.tabId == activeTab).tabFields.map(({ label, value }) => (
                            <div className="pokemon-detail__info-line">
                                <div className="pokemon-detail__info-line__label">{label}</div>
                                <div className="pokemon-detail__info-line__content">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonDetail;

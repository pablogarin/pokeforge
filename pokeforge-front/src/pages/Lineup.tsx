import { useState } from 'react';
import ActivePokemon from '../components/ActivePokemon';
import PokeBall from '../components/PokeBall';
import PokemonForm from '../components/PokemonForm';
import CurrentPokemon from '../components/CurrentPokemon';
import { type UserPokemon, type Pokemon } from '../types/pokemon';
import './Lineup.css';

const Lineup = () => {
    const [lineup, setLineup] = useState<UserPokemon[]>([]);
    if (lineup.length == 0) {
        return (<PokemonForm />);
    }

    return (
        <div className="lineup w-1/2 h-full min-w-[600px] mx-auto rounded-md">
            <div className="flex flex-col relative h-full p-[12px] z-10">
                <div className="flex flex-1">
                    {lineup.length > 0 && (
                        <>
                            <div className="flex flex-1">
                                <CurrentPokemon pokemon={lineup.pop()} />
                            </div>
                            <div className="flex flex-1 flex-col">
                                {lineup.map((pokemon) => (<ActivePokemon key={pokemon.id} pokemon={pokemon} />))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-end w-full">
                    <div className="flex flex-1 justify-start items-center bg-white border-4 border-black text-black h-[60px] px-8">Choose a POKeMON</div>
                    <div className="flex w-[140px] ml-2">
                        <PokeBall text="ADD" />
                    </div>
                    { /* <Dialog title="Welcome!" body="This is your AId for playing pokemon Fire Red and Leaf Green!" hasMore={true} /> */}
                </div>
            </div>
        </div>
    );
}


export default Lineup;

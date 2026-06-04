import { type Pokemon } from '../types/pokemon';
import PokemonImg from '../components/PokemonImg';

type PokemonCardProps = {
    pokemon: Pokemon,
}

const convertHeight = (height: number) => {
    const imperial = Number((height * 328) / 1000).toFixed(2);
    const feet = imperial.split('.')[0];
    const inches = imperial.split('.')[1][0];
    return `${feet}'${inches}"`;
}

const convertWeight = (weight: number) => {
    return Number((weight / 10) * 2.2).toFixed(1) + ' lbs.';
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-[#A8B820]/50" onClick={() => setShow(false)}>
            <div className="flex flex-col w-[500px] h-[300px] rounded-xl border-[#C1B085] border-4 text-black">
                <div className="flex flex-1 bg-[#F8F8F8] justify-between w-full min-h-0">
                    <div className="flex flex-1 flex-col justify-start px-8 py-12">
                        <div className="flex flex-1 items-end pb-4">No{pokemon.id.toString().padStart(3, '0')} <span className="text-lg pl-4">{pokemon.name.toUpperCase()}</span></div>
                        <div className="flex flex-1 items-center">{pokemon.genus.toUpperCase()}</div>
                        <div className="flex flex-1 items-center">HT {convertHeight(pokemon.height)}</div>
                        <div className="flex flex-1 items-center">WT {convertWeight(pokemon.weight)}</div>
                    </div>
                    <div className="flex flex-1 h-full justify-center items-center">
                        <PokemonImg pokemonId={pokemon.id} height="150" width="150" />
                    </div>
                </div>
                <div className="flex h-[130px] bg-[#E0D8C1] border-[#796037] border-t-4 justify-start items-center p-4 min-h-0">
                    {pokemon.flavorText}
                </div>
            </div>
        </div>
    );
}

export default PokemonCard;

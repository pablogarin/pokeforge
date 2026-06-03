type PokemonImgProps = {
    pokemonId: number;
}

const PokemonImg = ({ pokemonId }: PokemonImgProps) => {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${pokemonId}.png`;
    return (
        <img src={url} />
    );
}

export default PokemonImg;

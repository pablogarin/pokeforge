type PokemonImgProps = {
    pokemonId: number,
    height: string,
    width: string,
}

const PokemonImg = ({ pokemonId, height, width }: PokemonImgProps) => {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${pokemonId}.png`;
    return (
        <img src={url} height={height} width={width} />
    );
}

export default PokemonImg;

type PokemonImgProps = {
    pokemonId: number,
    height: string,
    width: string,
}

const PokemonImg = ({ pokemonId, height, width }: PokemonImgProps) => {
    const subfolder = pokemonId > 151 ? 'ruby-sapphire' : 'firered-leafgreen';
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/versions/generation-iii/${subfolder}/${pokemonId}.png`;
    return (
        <img src={url} height={height} width={width} />
    );
}

export default PokemonImg;

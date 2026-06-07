type PokemonImgProps = {
    pokemonId: number,
    height: string,
    width: string,
    isIcon?: boolean,
}

const getUriFromId = (id: number, isIcon: boolean = false) => {
    if (isIcon) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
    }
    const subfolder = id > 151 ? 'ruby-sapphire' : 'firered-leafgreen';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/versions/generation-iii/${subfolder}/${id}.png`;
}

const PokemonImg = ({ pokemonId, height, width, isIcon }: PokemonImgProps) => {
    const url = getUriFromId(pokemonId, isIcon);
    return (
        <img src={url} height={height} width={width} />
    );
}

export default PokemonImg;

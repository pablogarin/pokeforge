import './ElementTypes.css';

type ElementTypesProps = {
    types: string[];
}


const ElementTypes = ({ types }: ElementTypesProps) => {
    const colorMap = {
        "normal": "#a8a77a",
        "fire": "#ee8130",
        "water": "#6390f0",
        "electric": "#f7d02c",
        "grass": "#7ac74c",
        "ice": "#96d9d6",
        "fighting": "#c22e28",
        "poison": "#a33ea1",
        "ground": "#e2bf65",
        "flying": "#a98ff3",
        "psychic": "#f95587",
        "bug": "#a6b91a",
        "rock": "#b6a136",
        "ghost": "#735797",
        "dragon": "#6f35fc",
        "dark": "#705746",
        "steel": "#b7b7ce",
        "fairy": "#d685ad"
    };
    const getColor = (type: string) => {
        return colorMap[type.toLowerCase()];
    }
    return (
        <div className="element-types">
            {types && types.map((type) => (
                <div style={{ backgroundColor: getColor(type) }} className="element-types__type"> {type.toUpperCase().slice(0, 6)}</div>
            ))
            }
        </div >
    );
}

export default ElementTypes;

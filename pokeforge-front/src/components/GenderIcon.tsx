import './GenderIcon.css';


type GenderIconProps = {
    gender: 'Male' | 'Female';
}

const mapGenderToClass = (gender: 'Male' | 'Female') => {
    if (gender == 'Male') return 'pokemon-gender__male';
    if (gender == 'Female') return 'pokemon-gender__female';
    return '';
}

const GenderIcon = ({ gender }: GenderIconProps) => {
    return (
        <div className="pokemon-gender">
            <div className={`pokemon-gender__symbol ${mapGenderToClass(gender)}`}></div>
        </div>
    );
}

export default GenderIcon;

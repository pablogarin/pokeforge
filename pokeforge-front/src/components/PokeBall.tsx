import './PokeBall.css';

type PokeBallProps = {
    text?: string;
    isOpen?: boolean;
}


const PokeBall = ({ text = '', isOpen = false }: PokeBallProps) => {
    return (
        <div className={`relative pokeball${isOpen ? ' pokeball_is-open' : ''}`}>
            <button className="w-[60px] h-[60px] rounded-full relative z-10">
                <div className="pokeball__upper bg-[#FF2020] h-[32px] w-[60px] rounded-tl-full rounded-tr-full border-[4px] border-[#333] relative z-10">
                    <div className="w-[20px] h-[20px] border-[4px] border-[#333] rounded-full bg-white absolute right-[16px] top-[17px]"></div>
                </div>
                <div className="pokeball__lower bg-white h-[32px] w-[60px] border-[4px] border-[#333] rounded-bl-full rounded-br-full relative z-0">
                    <div className="bg-[#0005] rounded-bl-full rounded-br-full w-[20px] h-[10px] border-[4px] border-t-0 border-[#333] absolute right-[16px] -top-[1px] z-10"></div>
                </div>
            </button>
            {!!text && (<div className="flex items-center h-14 bg-[#7358B5] absolute text-white top-3 left-16 px-8 z-0 rounded-tr-[12px] rounded-br-[12px] border-4 border-[#333]">{text}</div>)}
        </div>
    );
}


export default PokeBall;

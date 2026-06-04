type DialogProps = {
    title: string,
    body: string,
    hasMore: boolean,
};


const Dialog = ({ title, body, hasMore }: DialogProps) => {
    return (
        <div className="absolute bottom-10 left-10 right-10 mx-auto my-8 p-1 bg-gradient-to-b from-[#A0A0A8] to-[#505058] rounded-[36px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">

            <div className="bg-white border-[4px] border-double border-[#D0C8D0] p-4 min-h-[100px] relative rounded-[32px]">

                <div className="text-[10px] text-pokedexRed uppercase mb-2 tracking-normal">
                    {title}
                </div>

                <p className="text-[14px] leading-[2rem] text-[#484048] text-pkmn-dialog-shadow antialiased">
                    {body}
                </p>
                {hasMore && (
                    <div className="absolute bottom-2 right-4 animate-bounce text-pokedexRed text-3xl">
                        ▼
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dialog;

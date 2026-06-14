import './Dialog.css'
import { useState, useEffect } from 'react';

type DialogProps = {
    body: string;
    title?: string;
    lines?: number;
    type?: 'error' | 'danger' | 'notification';
    dismiss: () => void;
};

/*
* TODO: This value makes it perfect for a single line of text,
* but it only works in full screen. The idea is to have a function
* that calculates the amount of text that'll fit in the allowed 
* space and use that to chunk the message.
*/
const SIZE = 38;

const chunkText = (text: string, size: number): string[] => {
    const chunks = [];
    let i = 0;
    let j = size;
    while (j < text.length) {
        while (j > i && text[j] != ' ') {
            j -= 1;
        }
        const chunk = text.slice(i, j);
        chunks.push(chunk);
        i = j + 1;
        j = i + size;
    }
    const chunk = text.slice(i, j);
    chunks.push(chunk);
    return chunks;
}

const Dialog = ({ title, body, lines = 2, type = 'notification', dismiss }: DialogProps) => {
    const [messageParts, setMessageParts] = useState<string[]>();
    const [partIndex, setPartIndex] = useState<number>(0);

    useEffect(() => {
        if (!body) return;
        const chunks = chunkText(body, SIZE);
        setMessageParts(chunks);
    }, []);

    /*
    * This is where we check if we have more text to show.
    * If not, we just close the dialog.
    * The dismiss action is delegated to the caller of the
    * Dialog component.
    */
    const checkAction = () => {
        if (partIndex < messageParts.length - lines) {
            setPartIndex(old => old + 1);
            return;
        }
        dismiss();
    }

    return (
        <div className={`dialog__container ${type} bg-gradient-to-b from-[#A0A0A8] to-[#505058] rounded-[36px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]`} onClick={() => checkAction()}>
            <div className="dialog__box bg-white border-[4px] border-double border-[#D0C8D0] p-4 min-h-[100px] relative rounded-[32px]">
                {title && (
                    <div className="dialog__box-title text-[10px] text-pokedexRed uppercase mb-2 tracking-normal">
                        {title}
                    </div>
                )}
                <div style={{
                    'height': `${lines}lh`
                }} className="dialog__box-body text-[14px] leading-[2rem] text-[#484048] text-pkmn-dialog-shadow antialiased" >
                    <div style={{ 'transform': `translateY(${partIndex * -1}lh)` }} className="dialog__message">
                        {messageParts && messageParts.map((chunk) => (
                            <p>{chunk}</p>)
                        )}
                    </div>
                    <div className="caret"></div>
                </div>
            </div>
        </div >
    );
}

export default Dialog;
